import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { DataBaseService } from "./database.service";

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.getOrThrow('NODE_ENV');
        return  {
          dialect: 'mysql',
          host: configService.getOrThrow(`DATA_BASE_HOST_${nodeEnv}`),
          port: parseInt(configService.getOrThrow(`DATA_BASE_PORT_${nodeEnv}`), 10),
          username: configService.getOrThrow(`DATA_BASE_USERNAME_${nodeEnv}`),
          password: configService.getOrThrow(`DATA_BASE_PASSWORD_${nodeEnv}`),
          database: configService.getOrThrow(`DATA_BASE_NAME_${nodeEnv}`),
          autoLoadModels: true,
          synchronize: true,
          logging: configService.getOrThrow(`DATA_BASE_LOGGING_${nodeEnv}`) === 'true' ? console.log : false,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DataBaseService],
  exports: [DataBaseService]
})
export class DatabaseModule {}