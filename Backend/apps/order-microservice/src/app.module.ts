import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database';

@Module({
  imports: [
    OrderModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
