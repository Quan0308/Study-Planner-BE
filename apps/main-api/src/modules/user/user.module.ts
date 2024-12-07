import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DatabaseModule } from "@app/database";
import { User, UserSchema } from "@app/database/entities";
import { UserRepository } from "@app/database/repositories";
import { FirebaseModule } from "@app/shared-modules/firebase";

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    FirebaseModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
