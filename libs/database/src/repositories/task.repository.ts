import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Task } from "../entities";
import { AbstractRepository, SortOptions } from "./abstract.repository";

@Injectable()
export class TaskRepository extends AbstractRepository<Task> {
  protected readonly logger = new Logger(TaskRepository.name);
  constructor(@InjectModel(Task.name) taskModel: Model<Task>) {
    super(taskModel);
  }

  override async findPaginate(
    filterQuery: FilterQuery<Task>,
    sortOptions: SortOptions<Task>,
    page: number,
    limit: number
  ): Promise<Task[]> {
    try {
      const documents = await this.model
        .find(filterQuery)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("subjectId", "color name")
        .lean<Task[]>();
      return documents;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
