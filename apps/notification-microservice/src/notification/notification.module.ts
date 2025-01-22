import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification, User } from '@app/common/models';

@Module({
  imports: [
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
