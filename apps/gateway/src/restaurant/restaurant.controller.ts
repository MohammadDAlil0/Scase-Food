import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRestaurantDto, UpdateRestaurantDto } from '@app/common/dto/orderDtos';
import { RestaurantGlobalDecorator, FindAllRestaurantDecorator, FindRestaurantDecorator, UpdateRestaurantDecorator, CreateRestaurantDecorator, DeleteRestaurantDecorator } from './decorators/restaurant-appliers.decorator';

@Controller('restaurant')
@RestaurantGlobalDecorator()
export class RestaurantController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy
  ) {}

  @Post()
  @CreateRestaurantDecorator()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    try {
      return await this.natsClient.send({ cmd: 'createRestaurant' }, createRestaurantDto).toPromise();
    }
    catch(error) {
      return error;
    }
  }

  @Get()
  @FindAllRestaurantDecorator()
  async findAll() {
    try {
      return await this.natsClient.send({ cmd: 'findAllRestaurant' }, {}).toPromise();
    }
    catch(error) {
      return error;
    }
  }

  @Get(':id')
  @FindRestaurantDecorator()
  async findOne(@Param('id') id: string) {
    try {
      return await this.natsClient.send({ cmd: 'findOneRestaurant' }, id).toPromise();
    }
    catch(error) {
      return error;
    }
  }

  @Patch(':id')
  @UpdateRestaurantDecorator()
  async update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    try {
      return await this.natsClient.send({ cmd: 'updateRestaurant' }, {
        id, 
        ...updateRestaurantDto
      }).toPromise();
    }
    catch(error) {
      return error;
    }
  }

  @Delete(':id')
  @DeleteRestaurantDecorator()
  async remove(@Param('id') id: string) {
    try {
      return await this.natsClient.send({ cmd: 'removeRestaurant' }, id).toPromise();
    }
    catch(error) {
      return error;
    }
  }
}
