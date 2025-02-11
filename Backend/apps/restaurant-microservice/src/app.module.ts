import { Module } from '@nestjs/common';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RestaurantModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
