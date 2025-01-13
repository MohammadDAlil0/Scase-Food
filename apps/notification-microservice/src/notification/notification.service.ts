import { Role } from '@app/common/constants';
import { CreateNotificationDto, CreateUsersNotificationsDto } from '@app/common/dto/notificationDtos';
import { Notification, User } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification) private readonly NotificationModel: typeof Notification,
    @InjectModel(User) private readonly UserModel: typeof User
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    await this.NotificationModel.create({
      ...createNotificationDto
    });
  }

  async findAll(userId: string) {
    return await this.NotificationModel.findAll({
      where: {
        userId
      }
    });
  }

  async createAdminsNotifications(createUsersNotificationsDto: CreateUsersNotificationsDto) {
    const adminsIds = await this.UserModel.findAll({
      where: {
        role: Role.ADMIN
      },
      attributes: ['id']
    });
    console.log(createUsersNotificationsDto.description);
    adminsIds.forEach(user => {
      this.create({
        userId: user.id,
        ...createUsersNotificationsDto
      })
    });
  }

  async createUsersNotifications(createUsersNotificationsDto: CreateUsersNotificationsDto) {
    const usersIds = await this.UserModel.findAll({
      where: {
        role: Role.USER
      }
    });

    usersIds.forEach(user => {
      this.create({
        userId: user.id,
        ...createUsersNotificationsDto
      })
    });
  }
}