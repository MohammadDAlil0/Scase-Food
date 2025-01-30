import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { DataBaseService } from "./database.service";
import { User, Order, FoodOrder, Food, Restaurant, Notification } from "../models";

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
          // sync: {force: true},
          logging: configService.getOrThrow(`DATA_BASE_LOGGING_${nodeEnv}`) === 'true' ? console.log : false,
        }
      },
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User, Order, FoodOrder, Food, Restaurant, Notification]),
  ],
  providers: [DataBaseService],
  exports: [DataBaseService, SequelizeModule],
})
export class DatabaseModule {}
