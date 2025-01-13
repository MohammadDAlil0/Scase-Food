import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Order, FoodOrder, Food, Restaurant, Notification } from '@app/common/models';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Order, FoodOrder, Food, Restaurant, Notification]),
    NatsClientModule
  ],
  controllers: [NotificationController],
  providers: [],
})
export class NotificationModule {}
