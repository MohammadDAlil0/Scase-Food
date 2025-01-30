import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JWTStrategy } from '../core/strategies/jwt.strategy';
import { NatsClientModule } from '@app/common/nats-client';

@Module({
  imports: [
    NatsClientModule,
  ],
  controllers: [UserController],
  providers: [JWTStrategy]
})
export class UserModule {}
