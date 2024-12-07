import { Module } from "@nestjs/common";
import { MainApiController } from "./main-api.controller";
import { MainApiService } from "./main-api.service";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "@app/database";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { BucketModule } from "../bucket/bucket.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    BucketModule,
    UserModule,
  ],
  controllers: [MainApiController],
  providers: [MainApiService],
})
export class MainApiModule {}
