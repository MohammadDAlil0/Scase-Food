import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { User, Order, Food, Restaurant, FoodOrder } from '@app/common/models';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
    imports: [
        SequelizeModule.forFeature([User, Order, FoodOrder, Food, Restaurant]),
        NatsClientModule,
        JwtModule.register({})
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
