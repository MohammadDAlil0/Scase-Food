import { Module } from '@nestjs/common';
import { FoodModule } from './food/food.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database';
@Module({
  imports: [
    FoodModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
