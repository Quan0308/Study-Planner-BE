import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional } from "class-validator";

export class CreateSessionDto {
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  break?: number;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => String)
  taskIds: string[];
}
