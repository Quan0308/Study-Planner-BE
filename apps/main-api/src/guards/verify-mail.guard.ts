import { RequestName } from "@app/types/enum";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class VerifyMailGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    return user.requestName === RequestName.VERIFY_MAIL;
  }
}
