import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { FirebaseJwtAuthGuard } from "../../guards";
import { TaskService } from "./task.service";
import { CurrentUser } from "../../decorators/current-user.decorator";
import { ICurrentUser } from "@app/types/interfaces";
import { ParseDatePipe } from "../../pipes";
import { CreateTaskDto, UpdateTaskDto } from "@app/types/dtos/task";

@UseGuards(FirebaseJwtAuthGuard)
@Controller("task")
export class TaskController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private taskService: TaskService) {}

  @Get("/weekly")
  async getWeeklyTasks(@CurrentUser() user: ICurrentUser, @Query("from", new ParseDatePipe()) start: Date) {
    return this.taskService.getWeeklyTasks(user.userId, start);
  }

  @Get(":id")
  async getTaskById(@CurrentUser() user: ICurrentUser, @Param("id") taskId: string) {
    return this.taskService.getTaskById(taskId);
  }

  @Post("")
  async createTask(@CurrentUser() user: ICurrentUser, @Body() data: CreateTaskDto) {
    return this.taskService.createTask(user.userId, data);
  }

  @Put("/:id")
  async updateTask(@CurrentUser() user: ICurrentUser, @Param("id") taskId: string, @Body() body: UpdateTaskDto) {
    return this.taskService.updateTask(taskId, body);
  }

  @Delete("/:id")
  async deleteTask(@CurrentUser() user: ICurrentUser, @Param("id") taskId: string) {
    return this.taskService.deleteTask(taskId);
  }
}
