import { Module } from "@nestjs/common";
import { MainApiController } from "./main-api.controller";
import { MainApiService } from "./main-api.service";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "@app/database";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { FilesModule } from "../files/files.module";
import { TaskModule } from "../task/task.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    FilesModule,
    UserModule,
    TaskModule,
  ],
  controllers: [MainApiController],
  providers: [MainApiService],
})
export class MainApiModule {}
