import { Module } from "@nestjs/common";
import { FoodModule } from "./food/food.module";
import { DatabaseModule } from "@app/common/database";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    FoodModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
