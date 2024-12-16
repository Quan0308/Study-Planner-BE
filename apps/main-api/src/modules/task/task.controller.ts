import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { FirebaseJwtAuthGuard } from "../../guards";
import { TaskService } from "./task.service";
import { CurrentUser } from "../../decorators/current-user.decorator";
import { ICurrentUser } from "@app/types/interfaces";
import { CreateTaskDto, UpdateTaskDto } from "@app/types/dtos/task";
import { FilterQuery } from "mongoose";
import { Task } from "@app/database/entities";
import { TaskPriorityLevel, TaskStatus } from "@app/types/enum";
import { SortOptions } from "@app/database/repositories/abstract.repository";
import { ParseDatePipe } from "../../pipes";

export type TaskQueryParams = FilterQuery<Task>;

function get6DaysFromDate(date: Date) {
  date.setDate(date.getDate() + 6);
  return date;
}

@UseGuards(FirebaseJwtAuthGuard)
@Controller("tasks")
export class TaskController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private taskService: TaskService) {}

  @Get()
  async getTasks(
    @CurrentUser() user: ICurrentUser,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("name") name?: string,
    @Query("status") status?: string | string[],
    @Query("priorityLevel") priorityLevel?: string | string[],
    @Query("subjectId") subjectId?: string | string[],
    @Query("from", new ParseDatePipe()) from?: Date,
    @Query("to", new ParseDatePipe()) to?: Date,
    @Query("sortBy") sortBy: string = "startDate",
    @Query("sortOrder") sortOrder: SortOptions<Task>[keyof Task] = "asc"
  ) {
    const filter: TaskQueryParams = {};
    filter.userId = user.userId;

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (status) {
      filter.status = { $in: Array.isArray(status) ? status : ([status] as TaskStatus[]) };
    }

    if (priorityLevel) {
      filter.priorityLevel = {
        $in: Array.isArray(priorityLevel) ? priorityLevel : ([priorityLevel] as TaskPriorityLevel[]),
      };
    }

    if (from) {
      filter.startDate = { $gte: from };

      if (to) {
        if (to < from) throw new BadRequestException("to must be after from");
        filter.endDate = { $lt: to };
      } else {
        filter.endDate = { $lt: get6DaysFromDate(from) };
      }
    } else if (to) {
      throw new BadRequestException("from is required when to is provided");
    }

    if (subjectId) {
      filter.subjectId = { $in: Array.isArray(subjectId) ? subjectId : [subjectId] };
    }

    const sortOptions: SortOptions<Task> = {};
    sortOptions[sortBy] = sortOrder;

    this.logger.log(`Fetching tasks with filter: ${JSON.stringify(filter)}`);

    return this.taskService.getAllTasks(filter, sortOptions, page, limit);
  }

  @Get(":id")
  async getTaskById(@Param("id") taskId: string) {
    return this.taskService.getTaskById(taskId);
  }

  @Post("")
  async createTask(@CurrentUser() user: ICurrentUser, @Body() data: CreateTaskDto) {
    return this.taskService.createTask(user.userId, data);
  }

  @Put("/:id")
  async updateTask(@Param("id") taskId: string, @Body() body: UpdateTaskDto) {
    return this.taskService.updateTask(taskId, body);
  }

  @Delete("/:id")
  async deleteTask(@Param("id") taskId: string) {
    return this.taskService.deleteTask(taskId);
  }
}
