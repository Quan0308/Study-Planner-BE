import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get("MAIL_HOST"),
          port: 587,
          secure: configService.get("MAIL_SECURE") === "true", // true for 465, false for other ports
          auth: {
            user: configService.get("MAIL_USER"), // your email
            pass: configService.get("MAIL_PASSWORD"), // your email password
          },
          tls: {
            rejectUnauthorized: configService.get("MAIL_TLS_REJECT_UNAUTHORIZED"), // only use this for testing
          },
        },
        defaults: {
          from: configService.get("MAIL_FROM"),
        },
        template: {
          dir: __dirname + "/templates",
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
