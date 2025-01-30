import { BadRequestException, ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { ClientProxy } from '@nestjs/microservices';
import { Status, StatusOfOrder } from '@app/common/constants';
import { DataBaseService } from '@app/common/database';
import { CreateUserDto, LoginDto, ChangeRoleDto, ChangeStatusDto } from '@app/common/dto/userDtos';
import { User, Order, Restaurant } from '@app/common/models';
import { FindAllUsersDto } from '@app/common/dto/userDtos/find-all-users.dto';
import { PaginationDto } from '@app/common/dto/globalDtos';
import { convertFiltersToLike } from '@app/common/constants/filter-converter';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Order) private readonly OrderModel: typeof Order,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    @Inject() private readonly jwt: JwtService,
    @Inject() private readonly config: ConfigService,
    @Inject() private readonly dataBaseService: DataBaseService
  ) { }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.UserModel.create<User>({ ...createUserDto, hash: createUserDto.password });
    const access_token = await this.getToken(user.id, user.email);
    this.natsClient.emit({ cmd: 'createAdminsNotifications' }, {
      title: 'New User',
      description: 'A new user has been signup please accept his request or refuse him. 😀'
    });
    return {
      ...user.dataValues,
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

  async getAllUsers(filter: FindAllUsersDto) {
    const { page, limit, ...rest } = filter;
    const offset = (filter.page - 1) * filter.limit || undefined;
    return await this.UserModel.findAll({
      where: convertFiltersToLike(rest),
      limit,
      offset
    });
  }

  async changeRole(changeRoleDto: ChangeRoleDto) {
    const updatedUser: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, changeRoleDto.userId);

    updatedUser.role = changeRoleDto.role;
    await updatedUser.save();

    this.natsClient.emit({ cmd: 'createNotification' }, {
      userId: updatedUser.id,
      title: 'Role Changed',
      description: 'Your role has been changed'
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

      const notMeOrders = orders.filter((order) => order.createdBy !== order.contributorId);

      if (notMeOrders.length > 0) {
        getUser.numberOfContributions++;
      }
      await getUser.save();

      this.natsClient.emit({ cmd: 'createNotificationosByIds' }, {
        paidedIds,
        title: `Your Order On The Way`,
        description: `${getUser.username} has orderd, get ready to eat.😋`
      });

      this.natsClient.emit({ cmd: 'createNotificationosByIds' }, {
        unPaidedIds,
        title: `No Money No Food`,
        description: `${getUser.username} has orderd, but you didn't paied yet. What are you waiting for?! 🤬`
      });
    }

    return getUser;
  }

  async getAllActiveContributors(filter: PaginationDto) {
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
    return contributors;
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
    const Contributors: User[] = await this.getAllActiveContributors({});
    Contributors.forEach(el => {
      if (el.status === Status.ONGOING && el.dateToCall < new Date(Date.now() - 3 * 60 * 60 * 1000)) { //Uncontribute who is still on-going and it has been 3 hours
        this.changeStatus({ userId: el.id });
        console.log(`${el.username} "has automatically uncontributed`);
      }
    });
  }
}