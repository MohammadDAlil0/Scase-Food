import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { FoodModule } from './food/food.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { NotificationModule } from './notification/notification.module';
import { DatabaseModule } from '@app/common/database';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FoodModule,
    RestaurantModule,
    NotificationModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
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