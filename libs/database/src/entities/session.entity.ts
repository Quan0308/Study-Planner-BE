import { Types } from "mongoose";
import { AbstractEntity } from "./abstract.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SessionStatus } from "@app/types/enum";

@Schema({ versionKey: false, timestamps: true })
export class Session extends AbstractEntity {
  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: Number, required: false })
  break: number;

  @Prop({ type: String, enum: SessionStatus, required: true, default: SessionStatus.INACTIVE })
  status: SessionStatus;

  @Prop({
    type: Types.ObjectId,
    ref: "Task",
    required: true,
  })
  taskId: string;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: string; // User who created the session, for analytics
}

export const SessionSchema = SchemaFactory.createForClass(Session);
