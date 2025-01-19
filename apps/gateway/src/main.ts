import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Midllewares
  app.use(helmet());

  // Set A Global Validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  // Set Up Configuration For Swagger
  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Exam Manager')
  .setDescription('The Exam Manager APIs')
  .setVersion('1.0')
  .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    autoTagControllers: true 
  });
  SwaggerModule.setup('api', app, documentFactory);

  // Run The Application
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
