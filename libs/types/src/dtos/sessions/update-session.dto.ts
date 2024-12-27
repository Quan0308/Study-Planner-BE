import { SessionStatus } from "@app/types/enum";
import { IsEnum } from "class-validator";

export class UpdateSessionDto {
  @IsEnum(SessionStatus)
  status: SessionStatus;
}
