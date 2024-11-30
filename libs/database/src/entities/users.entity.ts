import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { AbstractEntity } from "./abstract.entity";

@Schema({ versionKey: false, timestamps: true })
export class User extends AbstractEntity {
  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
