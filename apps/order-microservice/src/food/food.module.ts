import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food, FoodOrder, Restaurant } from '@app/common/models';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    SequelizeModule.forFeature([Food, Restaurant, FoodOrder]),
    NatsClientModule, 
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
