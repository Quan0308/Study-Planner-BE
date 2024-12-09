import { BucketPermissionsEnum, BucketUploadStatusEnum } from "@app/types/enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractEntity } from "./abstract.entity";

@Schema({ versionKey: false, timestamps: true })
export class Bucket extends AbstractEntity {
  @Prop()
  name: string;

  @Prop()
  owner: string;

  @Prop({
    type: String,
    enum: BucketPermissionsEnum,
    default: BucketPermissionsEnum.PUBLIC,
    required: true,
  })
  permission: BucketPermissionsEnum;

  @Prop({
    type: String,
    enum: BucketUploadStatusEnum,
    default: BucketUploadStatusEnum.PENDING,
    required: true,
  })
  uploadStatus: BucketUploadStatusEnum;
}

export const BucketSchema = SchemaFactory.createForClass(Bucket);
