import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { AddFoodDto, CreateOrderDto, GetOrdersOfContributionDto } from '@app/common/dto/orderDtos';

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,

  ) { }

  @MessagePattern({ cmd: 'createOrder' })
  async createOrder(@Payload() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @MessagePattern({ cmd: 'changeStatusOfOrder' })
  changeStatusOfOrder(@Payload() orderId: string) {
    return this.orderService.changeStatusOfOrder(orderId);
  }


  @MessagePattern({ cmd: 'getMyOrders' })
  getMyOrders(@Payload() userId: string) {
    return this.orderService.getMyOrders(userId);
  }

  @MessagePattern({ cmd: 'getOrdersOfContribution' })
  getOrdersOfContribution(@Payload() getOrdersOfContributionDto: GetOrdersOfContributionDto) {
    return this.orderService.getOrdersOfContribution(getOrdersOfContributionDto);
  }

  @MessagePattern({ cmd: 'addFoodToOrder' })
  addFoodToOrder(@Payload() addFoodDto: AddFoodDto) {
    return this.orderService.addFoodToOrder(addFoodDto);
  }

  @MessagePattern({ cmd: 'removeFoodFromOrder' })
  removeFoodFromOrder(@Payload() { orderId, foodId }: { orderId: string, foodId: string }) {
    this.orderService.removeFoodFromOrder(orderId, foodId);
  }

  @MessagePattern({ cmd: 'getFoodOfOrder' })
  getFoodOfOrder(@Payload() orderId: string) {
    return this.orderService.getFoodOfOrder(orderId);
  }
}
