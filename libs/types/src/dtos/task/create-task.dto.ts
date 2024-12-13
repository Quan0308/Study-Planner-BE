import { Task } from "@app/database/entities";
import { TaskPriorityLevel, TaskStatus } from "@app/types/enum";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto extends PartialType(OmitType(Task, ["userId"] as const)) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
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
