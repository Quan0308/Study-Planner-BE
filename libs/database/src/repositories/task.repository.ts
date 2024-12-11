import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task } from "../entities";
import { AbstractRepository } from "./abstract.repository";

@Injectable()
export class TaskRepository extends AbstractRepository<Task> {
  protected readonly logger = new Logger(TaskRepository.name);
  constructor(@InjectModel(Task.name) taskModel: Model<Task>) {
    super(taskModel);
  }
}
