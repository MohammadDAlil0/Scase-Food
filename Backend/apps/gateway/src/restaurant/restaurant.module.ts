import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [NatsClientModule],
  controllers: [RestaurantController],
  providers: [],
})
export class RestaurantModule { }
