import { Role } from '@app/common/constants';
import { CreateNotificationDto, CreateNotificationsByIdsDto, CreateUsersNotificationsDto } from '@app/common/dto/notificationDtos';
import { FindUsersNotificationsDto } from '@app/common/dto/notificationDtos/find-user-notifications.dto';
import { Notification, User } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification) private readonly NotificationModel: typeof Notification,
    @InjectModel(User) private readonly UserModel: typeof User
  ) { }
  async create(createNotificationDto: CreateNotificationDto) {
    await this.NotificationModel.create({
      ...createNotificationDto
    });
  }

  async findAll(filter: FindUsersNotificationsDto) {
    const limit = filter.limit || undefined;
    const offset = (filter.page - 1) * filter.limit || undefined;
    
    const notificationsAs = await this.NotificationModel.findAll({
      where: {
        userId: filter.userId,
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const notifications = await Promise.all(
      notificationsAs.map(async (notifications) => {
        notifications.seen = true;
        return await notifications.save();
        
      })
    );
    
    const noNotifications = await this.NotificationModel.count({ where: { userId: filter.userId } });

    return {
      notifications,
      noNotifications
    }
  }

  async getUnSeenNotifications(userId: string) {
    return await this.NotificationModel.count({
      where: {
        userId,
        seen: false
      }
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