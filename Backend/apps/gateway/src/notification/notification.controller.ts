import { Controller, Get, Inject } from "@nestjs/common";
import { FindAllNotificationDecorator } from "./decorators/notification-appliers.decorator";
import { ClientProxy } from "@nestjs/microservices";
import { User } from "@app/common/models";
import { GetUser } from "../core/decorators";

@Controller('Notification')
export class NotificationController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy
  ) { }

  @Get()
  @FindAllNotificationDecorator()
  async findAll(@GetUser() curUser: User) {
    try {
      return await this.natsClient.send({ cmd: 'findAllNotification' }, curUser.id).toPromise();
    }
    catch (error) {
      return error;
    }
  }
}
