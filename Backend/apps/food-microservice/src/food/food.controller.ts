import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FoodService } from './food.service';
import { CreateFoodDto, UpdateFoodDto, FindAllFoodDto } from '@app/common/dto/foodDtos';

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
    this.foodService.remove(id);
  }
}
