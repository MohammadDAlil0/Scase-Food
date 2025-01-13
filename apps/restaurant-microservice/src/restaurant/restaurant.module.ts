import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from '@app/common/models';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    SequelizeModule.forFeature([Restaurant]),
    NatsClientModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
