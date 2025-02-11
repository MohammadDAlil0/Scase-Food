import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, FindAllRestaurantsDto, UpdateRestaurantDto } from '@app/common/dto/restaurantDtos';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @MessagePattern({ cmd: 'createRestaurant' })
  create(@Payload() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @MessagePattern({ cmd: 'findAllRestaurant' })
  findAll(@Payload() filter: FindAllRestaurantsDto) {
    return this.restaurantService.findAll(filter);
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
    this.restaurantService.remove(id);
  }

}
