import { RequestName } from "@app/types/enum";
import { IsEnum, IsNotEmpty } from "class-validator";

export class VerifyOtpDto {
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsNotEmpty({ message: "otp is required" })
  otp: string;

  @IsEnum(RequestName, { message: "Invalid request name" })
  action: RequestName;
}
