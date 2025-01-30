import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    NatsClientModule, 
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
