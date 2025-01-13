import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from '@app/common/dto/notificationDtos/create-notification.dto';
import { CreateUsersNotificationsDto } from '@app/common/dto/notificationDtos/create-users-notifications.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: 'createNotification' })
  create(@Payload() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @MessagePattern({ cmd: 'createAdminsNotifications' })
  createAdminsNotifications(@Payload() createUsersNotificationsDto: CreateUsersNotificationsDto) {
    return this.notificationService.createAdminsNotifications(createUsersNotificationsDto);
  }
  
  @MessagePattern({ cmd: 'createUsersNotifications' })
  createUsersNotifications(@Payload() createUsersNotificationsDto: CreateUsersNotificationsDto) {
    return this.notificationService.createUsersNotifications(createUsersNotificationsDto);
  }

  @MessagePattern({ cmd: 'findAllNotification' })
  findAll(@Payload() userId: string) {
    return this.notificationService.findAll(userId);
  }
}
