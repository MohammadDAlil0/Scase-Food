import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { NatsClientModule } from '@app/common/nats-client';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        NatsClientModule,
        JwtModule.register({}),
        ScheduleModule.forRoot(),
        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.getOrThrow('EMAIL_HOST'),
                    secure: false,
                    auth: {
                        user: configService.getOrThrow('EMAIL_USERNAME'),
                        pass: configService.getOrThrow('EMAIL_PASSWORD')
                    }
                },
                defaults: {
                    from: `"No Reply" <${configService.getOrThrow('EMAIL_FROM')}>`
                }
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }
