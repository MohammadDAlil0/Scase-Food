import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    NatsClientModule,
  ],
  controllers: [FoodController],
  providers: [],
})
export class FoodModule {}
