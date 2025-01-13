import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { AddFoodDecorator, CreateFoodDecorator, DeleteFoodDecorator, DeleteFoodFromOrderDecorator, FindAllFoodDecorator, FindFoodDecorator, FoodGlobalDecorator, UpdateFoodDecorator } from './decorators/food-appliers.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { AddFoodDto, CreateFoodDto, UpdateFoodDto } from '@app/common/dto/foodDtos';

@Controller('food')
@FoodGlobalDecorator()
export class FoodController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy
  ) {}

  @Post('addFoodToOrder')
  @AddFoodDecorator()
  async addFood(@Body() addFoodDto: AddFoodDto) {
    try {
      return await this.natsClient.send({ cmd: 'addFoodToOrder' }, addFoodDto).toPromise();
    } catch(error) {
      return error;
    }
  }

  @Delete('removeFoodFromOrder/:orderId/:id')
  @DeleteFoodFromOrderDecorator()
  async removeFoodFromOrder(@Param('id') id: string) {
    try {
      return await this.natsClient.send({ cmd: 'removeFoodFromOrder' }, id).toPromise();
    }
    catch(error) {
      return error;
    }
  }

  @Post()
  @CreateFoodDecorator()
  async create(@Body() createFoodDto: CreateFoodDto) {
    try {
      return await this.natsClient.send({ cmd: 'createFood' }, createFoodDto).toPromise();
    }
    catch(error) {
      return error;
    }
  }

  @Get()
  @FindAllFoodDecorator()
  async findAll() {
    try {
      return await this.natsClient.send({ cmd: 'findAllFood' }, {}).toPromise();
    }
    catch(error) {
      return error;
    }
  }

  @Get(':id')
  @FindFoodDecorator()
  async findOne(@Param('id') id: string) {
    try {
      return await this.natsClient.send({ cmd: 'findOneFood' }, id).toPromise();
    }
    catch(error) {
      return error;
    }
  }

  @Patch(':id')
  @UpdateFoodDecorator()
  async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    try {
      return await this.natsClient.send({ cmd: 'updateFood' }, {
        id, 
        ...updateFoodDto
      }).toPromise();
    }
    catch(error) {
      return error;
    }
  }
  

  @Delete(':id')
  @DeleteFoodDecorator()
  async remove(@Param('id') id: string) {
    try {
      return await this.natsClient.send({ cmd: 'removeFood' }, id).toPromise();
    }
    catch(error) {
      return error;
    }
  }

}
