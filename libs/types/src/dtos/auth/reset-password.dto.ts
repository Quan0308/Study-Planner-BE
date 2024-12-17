import { IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty({ message: "New password is required" })
  newPassword: string;
}
