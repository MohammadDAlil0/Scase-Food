import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import {  CreateFoodDecorator, DeleteFoodDecorator, FindAllFoodDecorator, FindFoodDecorator, FoodGlobalDecorator, UpdateFoodDecorator } from './decorators/food-appliers.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { CreateFoodDto, FindAllFoodDto, UpdateFoodDto } from '@app/common/dto/foodDtos';
import { lastValueFrom } from 'rxjs';

@Controller('food')
@FoodGlobalDecorator()
export class FoodController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy
  ) {}

  @Post()
  @CreateFoodDecorator()
  async create(@Body() createFoodDto: CreateFoodDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'createFood' }, createFoodDto)
    );
  }

  @Get()
  @FindAllFoodDecorator()
  async findAll(@Query() filter: FindAllFoodDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'findAllFood' }, filter)
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
    await lastValueFrom(
      this.natsClient.emit({ cmd: 'removeFood' }, id)
    );
  }

}
