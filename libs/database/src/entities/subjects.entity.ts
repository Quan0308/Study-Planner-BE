import { Types } from "mongoose";
import { AbstractEntity } from "./abstract.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false, timestamps: true })
export class Subject extends AbstractEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: false,
  })
  color: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
