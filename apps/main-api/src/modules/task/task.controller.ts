import {
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

export type TaskQueryParams = FilterQuery<Task>;

function getStartOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay();
  const diff = date.getDate() - dayOfWeek;
  return new Date(date.setDate(diff));
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
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
    @Query("status") status?: string,
    @Query("priorityLevel") priorityLevel?: string,
    @Query("subjectId") subjectId?: string,
    @Query("weekly") weekly?: string,
    @Query("sortBy") sortBy: string = "startDate",
    @Query("sortOrder") sortOrder: SortOptions<Task>[keyof Task] = "asc"
  ) {
    const filter: TaskQueryParams = {};
    filter.userId = user.userId;

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (status) {
      filter.status = { $in: status.split(",") as TaskStatus[] };
    }

    if (priorityLevel) {
      filter.priorityLevel = { $in: priorityLevel.split(",") as TaskPriorityLevel[] };
    }

    if (subjectId) {
      filter.subjectId = { $in: subjectId.split(",") };
    }

    if (weekly) {
      const weeklyDate = new Date(weekly);
      const startOfWeek = getStartOfWeek(weeklyDate);
      const endOfWeek = getEndOfWeek(weeklyDate);
      filter.startDate = { $gte: startOfWeek, $lte: endOfWeek };
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
