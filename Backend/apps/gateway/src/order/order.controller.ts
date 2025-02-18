import { PaginationDto } from "@app/common/dto/globalDtos";
import { CreateOrderDto, AddFoodDto } from "@app/common/dto/orderDtos";
import { User } from "@app/common/models";
import { Controller, Inject, Post, Body, Put, Param, Get, Query, Delete } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { GetUser, GetContributor } from "../core/decorators";
import { CraeteOrderDecorators, ChangeStatusOfOrderDecorators, GetMyOrdersDecorators, getOrdersOfContributionDecorators, AddFoodDecorators, DeleteFoodFromOrderDecorators } from "./decorators/order-appliers.decorator";

@Controller('order')
export class OrderController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy
  ) { }

  @Post('createOrder')
  @CraeteOrderDecorators()
  async createOrder(
    @GetUser('id') createdBy: string,
    @GetContributor() contributor: User,
    @Body() createOrderDto: CreateOrderDto
  ) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'createOrder' }, {
        ...createOrderDto,
        createdBy,
        numberOfContributions: contributor.numberOfContributions,
        restaurantId: contributor.restaurantId
      })
    );
  }

  @Put('changeStatusOfOrder/:orderId')
  @ChangeStatusOfOrderDecorators()
  async changeStatusOfOrder(@Param('orderId') orderId: string) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'changeStatusOfOrder' }, orderId)
    );
  }

  @Get('GetMyOrders')
  @GetMyOrdersDecorators()
  async getMyOrders(@GetUser('id') userId: User, @Query() filter: PaginationDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'getMyOrders' }, {
        ...filter,
        userId
      })
    );
  }

  @Get('getOrdersOfContribution')
  @getOrdersOfContributionDecorators()
  async getOrdersOfContribution(@Query() filter: PaginationDto, @GetUser() user: User) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'getOrdersOfContribution' }, {
        ...filter,
        ...user.dataValues
      })
    );
  }

  @Post('addFoodToOrder')
  @AddFoodDecorators()
  async addFood(@Body() addFoodDto: AddFoodDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'addFoodToOrder' }, addFoodDto)
    );
  }

  @Delete('removeFoodFromOrder/:orderId/:foodId')
  @DeleteFoodFromOrderDecorators()
  async removeFoodFromOrder(@Param('orderId') orderId: string, @Param('foodId') foodId: string) {
    await lastValueFrom(
      this.natsClient.emit({ cmd: 'removeFoodFromOrder' }, { orderId, foodId })
    );
  }
}
