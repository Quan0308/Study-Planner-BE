import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { AbstractEntity } from "./abstract.entity";
import { UserRole } from "@app/types/enum/user-role.enum";

@Schema({ versionKey: false, timestamps: true })
export class User extends AbstractEntity {
  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  uid: string;

  @Prop({
    type: String,
    enum: UserRole,
    required: true,
    default: UserRole.LEARNER,
  })
  role: UserRole;

  @Prop({
    type: String,
    required: true,
  })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
