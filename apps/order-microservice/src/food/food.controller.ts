import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FoodService } from './food.service';
import { CreateFoodDto, UpdateFoodDto, AddFoodDto, FindAllFoodDto } from '@app/common/dto/foodDtos';

@Controller()
export class FoodController {
  constructor(
    private readonly foodService: FoodService,

  ) {}

  @MessagePattern({ cmd: 'createFood' })
  create(@Payload() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto);
  }

  @MessagePattern({ cmd: 'findAllFood' })
  findAll(@Payload() filter: FindAllFoodDto) {
    return this.foodService.findAll(filter);
  }

  @MessagePattern({ cmd: 'findOneFood' })
  findOne(@Payload() id: string) {
    return this.foodService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateFood' })
  update(@Payload() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(updateFoodDto);
  }

  @MessagePattern({ cmd: 'removeFood' })
  remove(@Payload() id: string) {
    return this.foodService.remove(id);
  }

  @MessagePattern({ cmd: 'addFoodToOrder' })
  addFoodToOrder(@Payload() addFoodDto: AddFoodDto) {
    return this.foodService.addFoodToOrder(addFoodDto);
  }

  @MessagePattern({ cmd: 'removeFoodFromOrder' })
  removeFoodFromOrder(@Payload() id: string) {
    return this.foodService.removeFoodFromOrder(id);
  }

  @MessagePattern({ cmd: 'getFoodOfOrder' })
  getFoodOfOrder(@Payload() orderId: string) {
    return this.foodService.getFoodOfOrder(orderId);
  }
}
