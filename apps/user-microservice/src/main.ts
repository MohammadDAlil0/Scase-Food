import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { badRequestExceptionFilter, httpExceptionFilter, SequelizeExceptionFilter } from '@app/common/filters/global-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222']
    }
  });

  app.useGlobalFilters(new SequelizeExceptionFilter, new badRequestExceptionFilter, new httpExceptionFilter);

  await app.listen();
}
bootstrap();
