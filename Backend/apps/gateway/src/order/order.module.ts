import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    NatsClientModule,
  ],
  controllers: [OrderController],
})
export class OrderModule { }
