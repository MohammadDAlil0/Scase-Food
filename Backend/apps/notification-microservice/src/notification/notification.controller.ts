import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { CreateNotificationDto, CreateUsersNotificationsDto, CreateNotificationsByIdsDto } from '@app/common/dto/notificationDtos';
import { FindUsersNotificationsDto } from '@app/common/dto/notificationDtos/find-user-notifications.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @MessagePattern({ cmd: 'createNotification' })
  create(@Payload() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @MessagePattern({ cmd: 'createAdminsUsersNotifications' })
  createAdminsUsersNotifications(@Payload() createUsersNotificationsDto: CreateUsersNotificationsDto) {
    return this.notificationService.createAdminsUsersNotifications(createUsersNotificationsDto);
  }

  @MessagePattern({ cmd: 'createAdminsNotifications' })
  createAdminsNotifications(@Payload() createUsersNotificationsDto: CreateUsersNotificationsDto) {
    return this.notificationService.createAdminsNotifications(createUsersNotificationsDto);
  }

  @MessagePattern({ cmd: 'createUsersNotifications' })
  createUsersNotifications(@Payload() createUsersNotificationsDto: CreateUsersNotificationsDto) {
    return this.notificationService.createUsersNotifications(createUsersNotificationsDto);
  }

  @MessagePattern({ cmd: 'createNotificationosByIds' })
  createNotificationosByIds(@Payload() createNotificationosByIdsDto: CreateNotificationsByIdsDto) {
    return this.notificationService.createNotificationosByIds(createNotificationosByIdsDto);
  }

  @MessagePattern({ cmd: 'findAllNotification' })
  findAll(@Payload() filter: FindUsersNotificationsDto) {
    return this.notificationService.findAll(filter);
  }

  @MessagePattern({ cmd: 'getUnSeenNotifications' })
  getUnSeenNotifications(@Payload() userId: string) {
    return this.notificationService.getUnSeenNotifications(userId);
  }
}
