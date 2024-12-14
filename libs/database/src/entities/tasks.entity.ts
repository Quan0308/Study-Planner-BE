import { Types } from "mongoose";
import { AbstractEntity } from "./abstract.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TaskPriorityLevel, TaskStatus } from "@app/types/enum";

@Schema({ versionKey: false, timestamps: true })
export class Task extends AbstractEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, required: false })
  startDate: Date;

  @Prop({ type: Date, required: false })
  endDate: Date;

  @Prop({ type: String, enum: TaskStatus, required: true, default: TaskStatus.TO_DO })
  status: TaskStatus;

  @Prop({
    type: Types.ObjectId,
    ref: "Subject",
    required: false,
  })
  subjectId: string;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    enum: TaskPriorityLevel,
    default: TaskPriorityLevel.LOW,
  })
  priorityLevel: TaskPriorityLevel;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
