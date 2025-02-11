import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NotificationModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
