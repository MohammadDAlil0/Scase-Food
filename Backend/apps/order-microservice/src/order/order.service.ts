import { StatusOfOrder, Status } from "@app/common/constants";
import { DataBaseService } from "@app/common/database";
import { CreateOrderDto, GetOrdersOfContributionDto, AddFoodDto } from "@app/common/dto/orderDtos";
import { FindMyOrdersDto } from "@app/common/dto/orderDtos/find-my-orders.dto";
import { Food, FoodOrder, Order, User } from "@app/common/models";
import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/sequelize";
import { lastValueFrom } from "rxjs";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Food) private readonly FoodModel: typeof Food,
    @InjectModel(FoodOrder) private readonly FoodOrderModel: typeof FoodOrder,
    @Inject() private readonly dataBaseService: DataBaseService,
    @InjectModel(Order) private readonly OrderModel: typeof Order,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto) {
    const order: Order = await this.OrderModel.create({
      ...createOrderDto,
      foods: undefined  // To remove foods attribute from the Create Order Dto
    });

    const foodPromises = createOrderDto.foods.map(async (doc) => {
      const food: Food = await lastValueFrom(this.natsClient.send({ cmd: 'findOneFood' }, doc.foodId));
      this.addFoodToOrder({
        foodId: food.id,
        orderId: order.id,
        number: doc.number,
        price: doc.number * food.price
      })
    });

    await Promise.all(foodPromises);
    await order.save();

    this.natsClient.emit({ cmd: 'createNotification' }, {
      userId: order.createdBy,
      title: 'Your Order Submitted Successfully',
      description: "Say 'wait' to your stomach, your order is on the way. 😉"
    });

    return order;
  }

  async changeStatusOfOrder(orderId: string) {
    const order: Order = await this.dataBaseService.findOneOrThrow(this.OrderModel, {
      where: { id: orderId },
      include: [{ model: User, as: 'contributor' }]
    });
    if (order.contributor.numberOfContributions > order.numberOfContributions) {
      order.statusOfOrder = (order.statusOfOrder === StatusOfOrder.DONE ? StatusOfOrder.UNPAIED : StatusOfOrder.DONE);
    } else {
      order.statusOfOrder = (order.statusOfOrder === StatusOfOrder.PAIED ? StatusOfOrder.UNPAIED : StatusOfOrder.PAIED);
    }
    if (order.statusOfOrder !== StatusOfOrder.UNPAIED) {
      this.natsClient.emit({ cmd: 'createNotification' }, {
        userId: order.createdBy,
        title: 'Thank You For Your Money',
        description: "I got your money, Don't be sad. Your stomack is more important than your money. 😁"
      });
    }
    await order.save();
    return order;
  }

  async getMyOrders(findMyOrdersDto: FindMyOrdersDto) {
    const limit = findMyOrdersDto.limit || undefined;
    const offset = (findMyOrdersDto.page - 1) * limit || undefined;
    const orders = await this.OrderModel.findAll<Order>({
      where: {
        createdBy: findMyOrdersDto.userId,
      },
      include: [
        {
          model: User,
          as: 'contributor'
        },
        {
          model: Food,
          as: 'foods'
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    const noOrders = await this.OrderModel.count({ where: { createdBy: findMyOrdersDto.userId } });
    return {
      orders,
      totalOrders: noOrders
    };
  }

  async getOrdersOfContribution(getOrdersOfContributionDto: GetOrdersOfContributionDto) {
    let numberOfContributions = getOrdersOfContributionDto.numberOfContributions;
    if (getOrdersOfContributionDto.status === Status.IDLE) numberOfContributions--;
    const limit = getOrdersOfContributionDto.limit || undefined;
    const offset = (getOrdersOfContributionDto.page - 1) * getOrdersOfContributionDto.limit || undefined;
    const orders = await this.OrderModel.findAll<Order>({
      where: {
        contributorId: getOrdersOfContributionDto.id,
        numberOfContributions: numberOfContributions
      },
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'creator'
        },
        {
          model: Food,
          as: 'foods'
        }
      ]
    });
    return orders;
  }

  async addFoodToOrder(addFoodDto: AddFoodDto) {
    return await this.FoodOrderModel.create({ ...addFoodDto });
  }

  async removeFoodFromOrder(orderId: string, foodId: string) {
    await this.dataBaseService.destroyOrThrow(this.FoodOrderModel, {
      where: {
        orderId,
        foodId
      }
    });
  }

  async getFoodOfOrder(id: string) {
    const foods = await this.FoodOrderModel.findAll<FoodOrder>({
      where: {
        orderId: id,
      }
    });
    return foods;
  }
}
