import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { FoodModule } from './food/food.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { NotificationModule } from './notification/notification.module';
import { DatabaseModule } from '@app/common/database';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    UserModule,
    FoodModule,
    RestaurantModule,
    NotificationModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{  // Limiting the number of request per hours.
      ttl: 60000,
      limit: 1000,
    }]),
    OrderModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}