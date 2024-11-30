import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "@app/database";
import { Request, RequestSchema, User, UserSchema } from "@app/database/entities";
import { MailModule } from "@app/shared-modules/mail/mail.module";
import { FirebaseModule } from "@app/shared-modules/firebase";
import { RequestRepository, UserRepository } from "@app/database/repositories";
import { FirebaseStrategy } from "../../strategies";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Request.name, schema: RequestSchema },
    ]),
    MailModule,
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, RequestRepository, FirebaseStrategy],
})
export class AuthModule {}
