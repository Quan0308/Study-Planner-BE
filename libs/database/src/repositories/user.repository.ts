import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../entities";
import { AbstractRepository } from "./abstract.repository";

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }
}
