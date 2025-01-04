import { Body, Controller, Get, ParseEnumPipe, Post, Query, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ResetPasswordGuard } from "../../guards/reset-password.guard";
import { FirebaseJwtAuthGuard, VerifyMailGuard } from "../../guards";
import { RequestName } from "@app/types/enum";
import {
  LogInDto,
  LogInWithProviderDto,
  RefreshTokenRequestDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from "@app/types/dtos/auth";
import { CurrentUser } from "../../decorators";
import { ICurrentUser } from "@app/types/interfaces";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signUp(@Body() data: RegisterDto) {
    const { email, password } = data;
    return this.authService.registerUser(email, password);
  }

  @Post("signin")
  async signIn(@Body() data: LogInDto) {
    const { email, password } = data;
    return this.authService.login(email, password);
  }

  @Post("provider")
  async signInWithProvider(@Body() data: LogInWithProviderDto) {
    return this.authService.loginWithProvider(data.credential, data.provider);
  }

  @Get("otp")
  async sendOtp(@Query("email") email: string, @Query("action", new ParseEnumPipe(RequestName)) action: RequestName) {
    return this.authService.sendOtp(email, action);
  }

  @Post("otp")
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtp(data.email, data.otp, data.action);
  }

  @Post("password-update")
  @UseGuards(FirebaseJwtAuthGuard, ResetPasswordGuard)
  async resetPassword(@Request() request: any, @Body() data: ResetPasswordDto) {
    const { uid } = request.user as { uid: string };
    return this.authService.updatePassword(uid, data.newPassword);
  }

  @Post("verify-account")
  @UseGuards(FirebaseJwtAuthGuard, VerifyMailGuard)
  async verifyAccount(@CurrentUser() user: ICurrentUser) {
    return this.authService.verifyMail(user.userId);
  }

  @Post("refresh")
  async refreshToken(@Body() data: RefreshTokenRequestDto) {
    return this.authService.refreshAccessToken(data.refreshToken);
  }
}
