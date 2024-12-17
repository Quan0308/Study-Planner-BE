import { Expose, Type } from "class-transformer";

import { User } from "@app/database/entities";
import { Gender } from "@app/types/enum";
import { OmitType, PartialType } from "@nestjs/mapped-types";

export class UpdateProfileDto extends PartialType(OmitType(User, ["role", "email", "uid"] as const)) {
  @Expose()
  username: string;

  @Expose()
  @Type(() => Date)
  dob: Date;

  @Expose()
  gender: Gender;
}
