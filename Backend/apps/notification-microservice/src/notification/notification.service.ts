import { Role } from '@app/common/constants';
import { CreateNotificationDto, CreateUsersNotificationsDto } from '@app/common/dto/notificationDtos';
import { CreateNotificationsByIdsDto } from '@app/common/dto/notificationDtos/create-notifications-by-ids.dto';
import { Notification, User } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

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
      },
      order: [ ['createdAt', 'DESC'] ],
      limit: 5
    });
  }

  async createAdminsUsersNotifications(createUsersNotificationsDto: CreateUsersNotificationsDto) {
    const adminsIds = await this.UserModel.findAll({
      where: {
        role: {
          [Op.or]: [Role.ADMIN, Role.USER]
        }
      },
      attributes: ['id']
    });
    adminsIds.forEach(user => {
      this.create({
        userId: user.id,
        ...createUsersNotificationsDto
      })
    });
  }

  async createAdminsNotifications(createUsersNotificationsDto: CreateUsersNotificationsDto) {
    const adminsIds = await this.UserModel.findAll({
      where: {
        role: Role.ADMIN
      },
      attributes: ['id']
    });
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
      console.log(user.id);
      this.create({
        userId: user.id,
        ...createUsersNotificationsDto
      })
    });
  }

  async createNotificationosByIds(createNotificationosByIds: CreateNotificationsByIdsDto) {
    createNotificationosByIds.usersId.forEach(userId => this.create({
      userId: userId,
      title: createNotificationosByIds.title,
      description: createNotificationosByIds.description
    }));
  }
}