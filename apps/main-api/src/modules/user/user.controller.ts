import { Body, Controller, Get, Logger, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { FirebaseJwtAuthGuard } from "../../guards";
import { CurrentUser, Serialize } from "../../decorators";
import { ICurrentUser } from "@app/types/interfaces";
import { UpdateProfileDto } from "@app/types/dtos/user";
import { ChangePasswordDto } from "@app/types/dtos/auth/change-password.dto";
import { BucketService } from "@app/shared-modules/bucket/bucket.service";

@UseGuards(FirebaseJwtAuthGuard)
@Controller("user")
export class UserController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private userService: UserService,
    private bucketService: BucketService
  ) {}

  @Get("/profile")
  async getUserProfile(@CurrentUser() user: ICurrentUser) {
    const profile = await this.userService.getUserProfile(user);

    const avatar = await this.bucketService.getUserMostRecentFile(user);

    return {
      ...profile,
      avatarId: avatar?._id || null,
    };
  }

  @Serialize(UpdateProfileDto)
  @Put("/profile")
  async updateUserProfile(@CurrentUser() user: ICurrentUser, @Body() updatedProfile: UpdateProfileDto) {
    return this.userService.updateUserProfile(user, updatedProfile);
  }

  @Put("/profile/password")
  async changePassword(@CurrentUser() user: ICurrentUser, @Body() body: ChangePasswordDto) {
    this.logger.verbose(`Changing password for user ${user.userId}`);
    return this.userService.changePassword(user.userId, body.oldPassword, body.newPassword);
  }
}
