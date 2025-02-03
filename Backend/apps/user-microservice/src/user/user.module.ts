import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { NatsClientModule } from '@app/common/nats-client';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        NatsClientModule,
        JwtModule.register({}),
        ScheduleModule.forRoot()
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }
