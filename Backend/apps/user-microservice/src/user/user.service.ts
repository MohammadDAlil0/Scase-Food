import { BadRequestException, ConsoleLogger, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { ClientProxy } from '@nestjs/microservices';
import { convertFiltersToLike, resetPasswordEmail, sendEmail, Status, StatusOfOrder } from '@app/common/constants';
import { DataBaseService } from '@app/common/database';
import { CreateUserDto, LoginDto, ChangeRoleDto, ChangeStatusDto, ResetPasswordDto, FindAllUsersDto, ForgotPasswordDto } from '@app/common/dto/userDtos';
import { User, Order, Restaurant } from '@app/common/models';
import { Op } from 'sequelize';
import { PaginationDto } from '@app/common/dto/globalDtos';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Order) private readonly OrderModel: typeof Order,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    @Inject() private readonly jwt: JwtService,
    @Inject() private readonly config: ConfigService,
    @Inject() private readonly dataBaseService: DataBaseService,
  ) { }

  async signup(createUserDto: CreateUserDto): Promise<Object> {
    const user = await this.UserModel.create<User>({ ...createUserDto, hash: createUserDto.password });
    const access_token = await this.getToken(user.id, user.email);
    this.natsClient.emit({ cmd: 'createAdminsNotifications' }, {
      title: 'New User',
      description: 'A new user has signed up. Please accept his request by changing his role or ignore this message. 😊'
    });
    return {
      ...user.dataValues,
      hash: undefined,  // To overide the hash attribute
      access_token
    }
  }

  async login(loginDto: LoginDto) {
    const user: User = await this.dataBaseService.findOneOrThrow(this.UserModel, {
      where: {
        email: loginDto.email
      },
      attributes: { include: ['hash'] }
    });

    const userMathPassword = await argon.verify(user.hash, loginDto.password);

    if (!userMathPassword) {
      throw new BadRequestException('Invalid Password');
    }

    const access_token = await this.getToken(user.id, user.email);
    return {
      ...user.dataValues,
      hash: undefined,  // To overide the hash attribute
      access_token
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user: User = await this.dataBaseService.findOneOrThrow(this.UserModel, {
      where: {
        email: forgotPasswordDto.email
      }
    });

    const resetToken = await user.createPasswordResetToken();
    await user.save({ validate: false });

    const resetURL = `${this.config.getOrThrow('CLIENT_PROTOCOL')}://${this.config.getOrThrow('CLIENT_HOST')}:${this.config.getOrThrow('CLIENT_PORT')}/reset-password/${resetToken}`;

    const message = resetPasswordEmail.replace('{{resetURL}}', resetURL);

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token is valid for 10 min',
        message: message
      });
      return 'Token sent to the email'
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validate: false });
      throw new HttpException('There was an error sending the email. Try again later!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(resetTokenDto: ResetPasswordDto) {
    const passwordResetToken = resetTokenDto.resetToken;
    const user: User = await this.dataBaseService.findOneOrThrow(this.UserModel, {
      where: {
        passwordResetToken,
        passwordResetExpires: { [Op.gte]: Date.now() }
      },
      attributes: { include: ['hash'] }
    });
    if (resetTokenDto.password !== resetTokenDto.confirmPassword) {
      throw new BadRequestException("Passwords don't match!")
    }
    user.hash = await argon.hash(resetTokenDto.password);
    user.passwordResetToken = user.passwordResetExpires = undefined;
    await user.save();
    return user;
  }

  async getAllUsers(filter: FindAllUsersDto) {
    const { page, limit, ...rest } = filter;
    const offset = (filter.page - 1) * filter.limit || undefined;
    const users = await this.UserModel.findAll({
      where: convertFiltersToLike(rest),
      limit,
      offset
    });
    const noUsers = await this.UserModel.count({where: convertFiltersToLike(rest)});
    return {
      users,
      totalUsers: noUsers
    }
  }

  async changeRole(changeRoleDto: ChangeRoleDto) {
    const updatedUser: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, changeRoleDto.userId);

    updatedUser.role = changeRoleDto.role;
    await updatedUser.save();

    this.natsClient.emit({ cmd: 'createNotification' }, {
      userId: updatedUser.id,
      title: 'Role Changed',
      description: 'Your role has been changed. 😇'
    });

    return updatedUser;
  }

  async getToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email
    }
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.getOrThrow<string>('JWT_EXPIRES_IN'),
      secret: this.config.getOrThrow<string>('JWT_SECRET')
    });
    return token;
  }

  async changeStatus(changeStatusDto: ChangeStatusDto) {
    const getUser: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, changeStatusDto.userId); // To get metadata
    getUser.status = (getUser.status === Status.ONGOING ? Status.IDLE : Status.ONGOING);
    if (getUser.status === Status.ONGOING) {
      const delay = Number(this.config.getOrThrow('DEFAULT_CALL_DELAY'));
      getUser.dateToCall = changeStatusDto.dateToCall || new Date(Date.now() + delay);
      if (!changeStatusDto.restaurantId) {
        throw new BadRequestException('Please provide a restaurant ID');
      }
      getUser.restaurantId = changeStatusDto.restaurantId;
      await getUser.save();
      this.natsClient.emit({ cmd: 'createAdminsUsersNotifications' }, {
        title: 'New Order',
        description: `Are you hungry? ${getUser.username} contribute to order. 😍`
      });
    } else {
      getUser.dateToCall = getUser.restaurantId = null;
      const orders = await this.OrderModel.findAll<Order>({
        where: {
          contributorId: getUser.id,
          numberOfContributions: getUser.numberOfContributions,
        }
      });
      const paidedIds = await Promise.all(
        orders.map(async (order) => {
          if (order.statusOfOrder !== StatusOfOrder.PAIED) return null;
          order.statusOfOrder = StatusOfOrder.DONE;
          await order.save();
          return order.id;
        })
      );

      const unPaidedIds = orders
        .filter((order) => order.statusOfOrder === StatusOfOrder.UNPAIED)
        .map((order) => order.id);

      const notMeOrders = orders.find((order) => order.createdBy !== order.contributorId);
      
      if (!notMeOrders) {
        this.OrderModel.destroy({
          where: {
            contributorId: getUser.id,
            numberOfContributions: getUser.numberOfContributions
          }
        });
        return await getUser.save();
      }
      getUser.numberOfContributions++;
      await getUser.save();

      this.natsClient.emit({ cmd: 'createNotificationosByIds' }, {
        paidedIds,
        title: `Your Order On The Way`,
        description: `${getUser.username} has orderd, get ready to eat.😋`
      });

      this.natsClient.emit({ cmd: 'createNotificationosByIds' }, {
        unPaidedIds,
        title: `No Money No Food`,
        description: `${getUser.username} has orderd, but you haven't paied yet. What are you waiting for?! 🤬`
      });
    }
    return getUser;
  }

  async getAllActiveContributors(filter: PaginationDto) {
    console.log(filter);
    const limit = filter.limit || undefined;
    const offset = (filter.page - 1) * filter.limit || undefined;
    const contributors = await this.UserModel.findAll<User>({
      where: { status: Status.ONGOING },
      limit,
      offset,
      include: [{
        model: Restaurant,
        as: 'restaurant'
      }]
    });
    const noContributors = await this.UserModel.count({ where: {status: Status.ONGOING } });

    return {
      contributors,
      noContributors
    };
  }

  async getTopContributors(filter: PaginationDto) {
    const limit = filter.limit || undefined;
    const offset = (filter.page - 1) * filter.limit || undefined;
    const contributors = await this.UserModel.findAll({
      order: [['numberOfContributions', 'DESC']],
      limit,
      offset
    });
    return contributors;
  }

  async uncontributeForgettens() {
    const contributors: User[] = (await this.getAllActiveContributors({})).contributors;
    contributors.forEach(el => {
      if (el.status === Status.ONGOING && el.dateToCall < new Date(Date.now() - 3 * 60 * 60 * 1000)) { //Uncontribute who is still on-going and it has been 3 hours
        this.changeStatus({ userId: el.id });
        console.log(`${el.username} "has automatically uncontributed`);
      }
    });
  }

  async deleteUser(userId: string) {
    await this.dataBaseService.destroyOrThrow(this.UserModel, {
      where: {id: userId}
    });
  }
}