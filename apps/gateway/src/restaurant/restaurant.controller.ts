import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRestaurantDto, FindAllRestaurantsDto, UpdateRestaurantDto } from '@app/common/dto/restaurantDtos';
import { RestaurantGlobalDecorator, FindAllRestaurantDecorator, FindRestaurantDecorator, UpdateRestaurantDecorator, CreateRestaurantDecorator, DeleteRestaurantDecorator } from './decorators/restaurant-appliers.decorator';
import { lastValueFrom } from 'rxjs';

@Controller('restaurant')
@RestaurantGlobalDecorator()
export class RestaurantController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy
  ) {}

  @Post()
  @CreateRestaurantDecorator()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'createRestaurant' }, createRestaurantDto)
      
    );
  }

  @Get()
  @FindAllRestaurantDecorator()
  async findAll(@Query() filter: FindAllRestaurantsDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'findAllRestaurant' }, filter)
      
    )
  }

  @Get(':id')
  @FindRestaurantDecorator()
  async findOne(@Param('id') id: string) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'findOneRestaurant' }, id)
    );
  }

  @Patch(':id')
  @UpdateRestaurantDecorator()
  async update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'updateRestaurant' }, {
        id, 
        ...updateRestaurantDto
      })
    );
  }

  @Delete(':id')
  @DeleteRestaurantDecorator()
  async remove(@Param('id') id: string) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'removeRestaurant' }, id)
    );
  }
}
