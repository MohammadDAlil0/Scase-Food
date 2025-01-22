import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food, FoodOrder, Restaurant } from '@app/common/models';
import { NatsClientModule } from '@app/common/nats-client';
import { DatabaseModule } from '@app/common/database';

@Module({
  imports: [
    NatsClientModule, 
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
