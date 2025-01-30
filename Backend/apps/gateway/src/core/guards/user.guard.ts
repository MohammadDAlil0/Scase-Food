import { Status, StatusOfOrder } from '@app/common/constants';
import { DataBaseService } from '@app/common/database';
import { Food, Order, User } from '@app/common/models';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, Inject, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Observable } from 'rxjs';

/**
 * Use this guard to prevent other users from editing non-own orders.
 */
@Injectable()
export class ContributorApi implements CanActivate {
  constructor(
    @InjectModel(Order) private readonly OrderModel: typeof Order,
    @Inject() private readonly dataBaseService: DataBaseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const curUser = request.user;
    const orderId = request.params.orderId || request.body.orderId;

    const order: Order = await this.dataBaseService.findByPkOrThrow(this.OrderModel, orderId);

    if (curUser.id !== order.contributorId) {
      throw new BadRequestException("You can't do this action");
    }

    return true;
  }
}

/**
 * Use this guard to prevent yourself to do some action on yourself.
 */
@Injectable()
export class NotMeApi implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const curUser = request.user;
    const userId = request.params.userId || request.body.userId;

    if (curUser.id === userId) {
      throw new BadRequestException("You can't do this action on yourself");
    }

    return true;
  }
}

/**
 * Use this gaurd to check if the contribution still on-goning.
 */
@Injectable()
export class StillOnGoingGuard implements CanActivate {
  constructor(
    @InjectModel(User) private readonly UserModel: typeof User,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const contributorId = request.body.contributorId || request.params.contributorId;

    const contributor = await this.UserModel.findOne({
      where: {
        id: contributorId,
        status: Status.ONGOING
      }
    });
    
    if (!contributor) {
      throw new ForbiddenException('contributor has already ordered');
    }
    request.contributor = contributor;

    return true;
  }
}

/**
 * Use this gaurd to check if the user is the own of the order.
 */
@Injectable()
export class UserOrderGuard implements CanActivate {
  constructor(
    @InjectModel(Order) private readonly OrderModel: typeof Order,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const orderId = request.body.orderId || request.params.orderId;
    const curUserId = request.user.id;
    
    const order = await this.OrderModel.findOne({
      where: {
        id: orderId,
        createdBy: curUserId
      }
    });

    if (!order) {
      throw new ForbiddenException("You don't have such an order ID");
    }

    return true;
  }
}

/**
 * Use this gaurd to check if the food belongs to the restaurant which the user want to order from. Also, it prevants to remove food from old orders.
 */
@Injectable()
export class FoodRestauranGuard implements CanActivate {
  constructor(
    @Inject() private readonly dataBaseService: DataBaseService,
    @InjectModel(Order) private readonly OrderModel: typeof Order,
    @InjectModel(Food) private readonly FoodModel: typeof Food
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const orderId = request.body.orderId || request.params.orderId;
    const foodId = request.body.foodId || request.params.foodId;
    const curUserId = request.user.id;

    
    const order: Order = await this.dataBaseService.findOneOrThrow(this.OrderModel, {
      where: {
        id: orderId,
        contributorId: curUserId,
      },
      include: [{ model: User, as: 'contributor' }]
    });

    if (order.contributor.numberOfContributions !== order.numberOfContributions) {
      throw new ForbiddenException('Do you think I am stupid! your order has already done')
    }

    if (order.statusOfOrder !== StatusOfOrder.UNPAIED) {
      throw new ForbiddenException('The user has already paided, make sure that the order is unpaided');
    }

    const food: Food = await this.dataBaseService.findByPkOrThrow(this.FoodModel, foodId);

    if (order.contributor.restaurantId !== food.restaurantId) {
      throw new ForbiddenException('Make sure you are addinga a food from the same restaurant')
    }

    return true;
  }
}
