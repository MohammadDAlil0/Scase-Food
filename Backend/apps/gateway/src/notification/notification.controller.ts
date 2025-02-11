import { Controller, Get, Inject, Query } from "@nestjs/common";
import { FindAllNotificationDecorator, GetUnSeenNotificationsDecorator } from "./decorators/notification-appliers.decorator";
import { ClientProxy } from "@nestjs/microservices";
import { User } from "@app/common/models";
import { GetUser } from "../core/decorators";
import { lastValueFrom } from "rxjs";
import { PaginationDto } from "@app/common/dto/globalDtos";
import { FindUsersNotificationsDto } from "@app/common/dto/notificationDtos/find-user-notifications.dto";

@Controller('Notification')
export class NotificationController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy
  ) { }

  @Get('CountUnseendNotfication')
  @GetUnSeenNotificationsDecorator()
  async getUnSeenNotifications(@GetUser('id') userId: User) {
    const count = await lastValueFrom(
      this.natsClient.send({ cmd: 'getUnSeenNotifications' }, userId)
    );
    return {count};
  }
  
  @Get()
  @FindAllNotificationDecorator()
  async findAll(@Query() filter: FindUsersNotificationsDto, @GetUser('id') userId: User) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'findAllNotification' }, {
        userId,
        ...filter
      })  
    );
  }
}
