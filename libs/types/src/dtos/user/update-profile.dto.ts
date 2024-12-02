import { User } from "@app/database/entities";
import { Gender } from "@app/types/enum";
import { PartialType, OmitType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";

export class UpdateProfileDto extends PartialType(OmitType(User, ["role", "email", "uid"] as const)) {
  @Expose()
  username: string;

  @Expose()
  dob: Date;

  @Expose()
  gender: Gender;
}
