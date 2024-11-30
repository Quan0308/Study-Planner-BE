import { IsNotEmpty } from "class-validator";

export class LogInWithProviderDto {
  @IsNotEmpty({ message: "Credential is required" })
  credential: string;

  @IsNotEmpty({ message: "Provider is required" })
  provider: string;
}
