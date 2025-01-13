import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { JWTStrategy } from '../core/strategies/jwt.strategy';
import { User, Order, FoodOrder, Food, Restaurant, Notification } from '@app/common/models';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    NatsClientModule,
    SequelizeModule.forFeature([User, Order, FoodOrder, Food, Restaurant, Notification])
  ],
  controllers: [UserController],
  providers: [JWTStrategy]
})
export class UserModule {}
