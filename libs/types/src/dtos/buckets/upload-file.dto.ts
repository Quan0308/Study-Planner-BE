import { BucketPermissionsEnum } from "@app/types/enum";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UploadFileDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Filename is required" })
  name: string;

  @IsOptional()
  @IsEnum(BucketPermissionsEnum, {
    message: `Permission must be one of the following values: ${Object.values(BucketPermissionsEnum).join(", ")}`,
  })
  permission: BucketPermissionsEnum;
}
