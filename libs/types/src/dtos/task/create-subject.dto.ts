import { Subject } from "@app/database/entities";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubjectDto extends PartialType(OmitType(Subject, ["userId"] as const)) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  color: string;
}
