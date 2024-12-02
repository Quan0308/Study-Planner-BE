import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { FirebaseJwtAuthGuard } from "../../guards";
import { CurrentUser, Serialize } from "../../decorators";
import { ICurrentUser } from "@app/types/interfaces";
import { UpdateProfileDto } from "@app/types/dtos/user";

@UseGuards(FirebaseJwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/profile")
  async getUserProfile(@CurrentUser() user: ICurrentUser) {
    return this.userService.getUserProfile(user);
  }

  @Serialize(UpdateProfileDto)
  @Put("/profile")
  async updateUserProfile(@CurrentUser() user: ICurrentUser, @Body() updatedProfile: UpdateProfileDto) {
    return this.userService.updateUserProfile(user, updatedProfile);
  }
}
