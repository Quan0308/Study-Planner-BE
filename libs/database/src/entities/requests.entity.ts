import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { AbstractEntity } from "./abstract.entity";
import { Types } from "mongoose";
import { RequestName } from "@app/types/enum";

@Schema({ versionKey: false, timestamps: true })
export class Request extends AbstractEntity {
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    enum: RequestName,
    default: RequestName.RESET_PASSWORD,
    required: true,
  })
  name: RequestName;

  @Prop({
    type: String,
    required: true,
  })
  verifyData: string;

  @Prop({
    type: Boolean,
    required: true,
    default: true,
  })
  status: boolean;

  @Prop({
    type: String,
    isNaN: true,
    default: null,
  })
  token: string | null;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
  })
  exp: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
