import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;
}
