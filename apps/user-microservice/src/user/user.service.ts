import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2'; 
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Status, StatusOfOrder } from '@app/common/constants';
import { DataBaseService } from '@app/common/database';
import { CreateUserDto, LoginDto, ChangeRoleDto, CreateOrderDto, ChangeStatusDto } from '@app/common/dto/userDtos';
import { User, Order } from '@app/common/models';
import { FindAllUsersDto } from '@app/common/dto/userDtos/find-all-users.dto';
import { lastValueFrom } from 'rxjs';
import { PaginationDto } from '@app/common/dto/globalDtos';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        @InjectModel(Order) private readonly OrderModel: typeof Order,
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
        @Inject() private readonly jwt: JwtService,
        @Inject() private readonly config: ConfigService,
        @Inject() private readonly dataBaseService: DataBaseService
    ) {}

    async signup(createUserDto: CreateUserDto) {
        const user = await this.UserModel.create<User>({ ...createUserDto, hash: createUserDto.password });
        const access_token = await this.getToken(user.id, user.email);
        this.natsClient.emit({ cmd: 'createAdminsNotifications' }, {
          title: 'New User',
          description: 'A new user has been signup please accept his request or refuse him'
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
      return await this.UserModel.findAll({
        where: {...rest},
        limit: filter.limit,
        offset: (filter.page - 1) * filter.limit
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
      // 
      const getUser: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, changeStatusDto.userId);
      getUser.status = (getUser.status === Status.ONGOING ? Status.IDLE : Status.ONGOING);
      if (getUser.status === Status.ONGOING) {
        this.natsClient.emit({ cmd: 'createUsersNotifications' }, {
          title: 'New Order',
          description: 'Are you hungry? Someone contribute to order'
        });
        getUser.dataToCall = changeStatusDto.dateToCall || new Date(Date.now() + 20 * 60 * 1000); //By default put 20 minutes to order. 
        getUser.resaurantId = changeStatusDto.restaurantId;
      } else {
        const [numberOfEffectedRows] = await this.OrderModel.update<Order>({
          statusOfOrder: StatusOfOrder.DONE
        }, {
          where: {
            contributorId: getUser.id,
            numberOfContribution: getUser.numberOfContributions,
            statusOfOrder: StatusOfOrder.PAIED
          }
        });
        if (numberOfEffectedRows !== 0) { // Find at least one order to prevent fake contributions
          getUser.numberOfContributions++;
        }
        getUser.dataToCall = getUser.resaurantId = null;
      }
      await getUser.save()
      return getUser;
    }

    async createOrder(createOrderDto: CreateOrderDto) {
      return await this.OrderModel.create({
        ...createOrderDto
      });
    }

    async submitOrder(orderId: string) {
      const order: Order = await this.dataBaseService.findByPkOrThrow(this.OrderModel, orderId);
      const orderedFood = await lastValueFrom(this.natsClient.send({ cmd: 'getFoodOfOrder' }, orderId));
      
      order.totalPrice = 0;
      orderedFood.forEach(element => {
        order.totalPrice += element.price;
      });
      order.statusOfOrder = StatusOfOrder.UNPAIED;
      await order.save();

      this.natsClient.emit({ cmd: 'createNotification' }, {
        userId: order.createdBy,
        title: 'Your Order Sumbmited Successfuly',
        desciption: "Say 'wait' to your stomack, your order on the queue"
      });
      
      return order;
    }

    async getAllActiveContributors(filter: PaginationDto) {
      const contributors = await this.UserModel.findAll<User>({
        where: {status: Status.ONGOING},
        limit: filter.limit,
        offset: (filter.page - 1) * filter.limit
      });
      return contributors;
    }

    async changeStatusOfOrder(orderId: string) {
      const order: Order = await this.dataBaseService.findOneOrThrow(this.OrderModel, {
        where: {id: orderId},
        include: [{ model: User, as: 'contributor'}]
      });
      if (order.contributor.numberOfContributions < order.numberOfContribution) {
        order.statusOfOrder = (order.statusOfOrder === StatusOfOrder.DONE ? StatusOfOrder.UNPAIED : StatusOfOrder.DONE);  
      } else {
        order.statusOfOrder = (order.statusOfOrder === StatusOfOrder.PAIED ? StatusOfOrder.UNPAIED : StatusOfOrder.PAIED);
      }
      if (order.statusOfOrder !== StatusOfOrder.UNPAIED) {
        this.natsClient.emit({ cmd: 'createNotification' }, {
          userId: order.createdBy,
          title: 'Thank you for your money',
          desciption: "I got your money, Don't be sad your stomack is more important than your money"
        });
      }
      await order.save();
      return order;
    }

    async getTopContributors(filter: PaginationDto) {
      const contributors = await this.UserModel.findAll({
        order: [ ['numberOfContributions', 'DESC'] ],
        limit: filter.limit,
        offset: (filter.page - 1) * filter.limit
      });
      return contributors;
    }

    async getMyOrders(userId: string) {
      const orders = await this.OrderModel.findAll<Order>({
        where: {
          createdBy: userId,
        }
      });
      return orders;
    }
}