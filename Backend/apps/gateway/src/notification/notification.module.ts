import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    NatsClientModule
  ],
  controllers: [NotificationController],
  providers: [],
})
export class NotificationModule { }
