import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty({ message: "Old password is required" })
  oldPassword: string;

  @IsNotEmpty({ message: "New password is required" })
  newPassword: string;
}
