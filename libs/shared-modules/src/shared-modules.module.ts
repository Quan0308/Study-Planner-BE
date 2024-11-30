import { Module } from "@nestjs/common";
import { SharedModulesService } from "./shared-modules.service";
import { FirebaseModule } from "./firebase/firebase.module";
import { MailModule } from "./mail/mail.module";

@Module({
  providers: [SharedModulesService],
  exports: [SharedModulesService],
  imports: [FirebaseModule, MailModule],
})
export class SharedModulesModule {}
