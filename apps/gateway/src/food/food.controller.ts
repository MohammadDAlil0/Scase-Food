import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { AddFoodDecorator, CreateFoodDecorator, DeleteFoodDecorator, DeleteFoodFromOrderDecorator, FindAllFoodDecorator, FindFoodDecorator, FoodGlobalDecorator, UpdateFoodDecorator } from './decorators/food-appliers.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { AddFoodDto, CreateFoodDto, UpdateFoodDto } from '@app/common/dto/foodDtos';
import { lastValueFrom } from 'rxjs';

@Controller('food')
@FoodGlobalDecorator()
export class FoodController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy
  ) {}

  @Post('addFoodToOrder')
  @AddFoodDecorator()
  async addFood(@Body() addFoodDto: AddFoodDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'addFoodToOrder' }, addFoodDto)
    );
  }

  @Delete('removeFoodFromOrder/:orderId/:id')
  @DeleteFoodFromOrderDecorator()
  async removeFoodFromOrder(@Param('id') id: string) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'removeFoodFromOrder' }, id)
    );
  }


  @Post()
  @CreateFoodDecorator()
  async create(@Body() createFoodDto: CreateFoodDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'createFood' }, createFoodDto)
    );
  }

  @Get()
  @FindAllFoodDecorator()
  async findAll() {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'findAllFood' }, {})
    );
  }

  @Get(':id')
  @FindFoodDecorator()
  async findOne(@Param('id') id: string) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'findOneFood' }, id)
    );
  }

  @Patch(':id')
  @UpdateFoodDecorator()
  async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'updateFood'}, {
        id, 
        ...updateFoodDto
      })
    );
  }
  

  @Delete(':id')
  @DeleteFoodDecorator()
  async remove(@Param('id') id: string) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'removeFood' }, id)
    );
  }

}
