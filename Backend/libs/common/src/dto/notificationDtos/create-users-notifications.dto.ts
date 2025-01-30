import { PickType } from "@nestjs/mapped-types";
import { CreateNotificationDto } from "./create-notification.dto";

export class CreateUsersNotificationsDto extends PickType(CreateNotificationDto, ['title', 'description']) {}