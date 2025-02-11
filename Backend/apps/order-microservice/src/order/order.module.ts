import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    NatsClientModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
