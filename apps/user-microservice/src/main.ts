import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomResponseInterceptor } from '@app/common/interceptors';
import { SequelizeExceptionFilter, badRequestExceptionFilter, httpExceptionFilter } from '@app/common/filters';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222']
    }
  });

  app.useGlobalFilters(new SequelizeExceptionFilter, new badRequestExceptionFilter, new httpExceptionFilter);
  app.useGlobalInterceptors(new CustomResponseInterceptor())

  await app.listen();
}
bootstrap();
