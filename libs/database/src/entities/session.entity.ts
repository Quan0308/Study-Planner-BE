import { Types } from "mongoose";
import { AbstractEntity } from "./abstract.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SessionStatus } from "@app/types/enum";

@Schema({ versionKey: false, timestamps: true })
export class Session extends AbstractEntity {
  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: Number, required: false, default: 0 })
  break: number;

  @Prop({ type: Number, required: true, default: 0 })
  trueDuration: number;

  @Prop({ type: String, enum: SessionStatus, required: true, default: SessionStatus.ACTIVE })
  status: SessionStatus;

  @Prop({
    type: Types.ObjectId,
    ref: "Task",
    required: true,
  })
  taskIds: string[];

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: string; // User who created the session, for analytics
}

export const SessionSchema = SchemaFactory.createForClass(Session);
