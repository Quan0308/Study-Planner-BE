import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { AbstractEntity } from "./abstract.entity";
import { Gender, UserRole } from "@app/types/enum";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

@Schema({ versionKey: false, timestamps: true })
export class User extends AbstractEntity {
  @Prop({
    type: String,
    required: true,
  })
  @IsEmail()
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  uid: string;

  @Prop({
    type: String,
    enum: UserRole,
    required: true,
    default: UserRole.LEARNER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Prop({
    type: String,
    required: true,
  })
  @IsOptional()
  username: string;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  @IsOptional()
  @IsDate()
  dob: Date;

  @Prop({
    type: String,
    enum: Gender,
    required: false,
    default: null,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
}

export const UserSchema = SchemaFactory.createForClass(User);
