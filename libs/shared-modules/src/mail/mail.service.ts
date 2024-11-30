import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  sendMail(toEmail: string, subject: string, template: string, context: any) {
    return this.mailerService.sendMail({
      to: toEmail,
      subject,
      template,
      context,
    });
  }
}
