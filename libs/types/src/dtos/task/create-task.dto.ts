import { Task } from "@app/database/entities";
import { TaskPriorityLevel, TaskStatus } from "@app/types/enum";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from "class-validator";

@ValidatorConstraint({ name: "endDateAfterStartDate", async: false })
class EndDateAfterStartDate implements ValidatorConstraintInterface {
  validate(endDate: Date, args: ValidationArguments) {
    const object = args.object as any;
    return !endDate || !object.startDate || endDate > object.startDate;
  }

  defaultMessage() {
    return "endDate must be after startDate";
  }
}

export class CreateTaskDto extends PartialType(OmitType(Task, ["userId"] as const)) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @Validate(EndDateAfterStartDate)
  endDate?: Date;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  subjectId?: string;

  @IsOptional()
  @IsEnum(TaskPriorityLevel)
  priorityLevel?: TaskPriorityLevel;
}
