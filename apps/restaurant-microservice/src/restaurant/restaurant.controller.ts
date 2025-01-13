import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from '@app/common/dto/orderDtos';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @MessagePattern({ cmd: 'createRestaurant' })
  create(@Payload() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @MessagePattern({ cmd: 'findAllRestaurant' })
  findAll() {
    return this.restaurantService.findAll();
  }

  @MessagePattern({ cmd: 'findOneRestaurant' })
  findOne(@Payload() id: string) {
    return this.restaurantService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateRestaurant' })
  update(@Payload() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantService.update(updateRestaurantDto);
  }

  @MessagePattern({ cmd: 'removeRestaurant' })
  remove(@Payload() id: string) {
    return this.restaurantService.remove(id);
  }

}
