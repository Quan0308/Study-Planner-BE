import { Task } from "@app/database/entities";
import { TaskRepository } from "@app/database/repositories";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { SubjectService } from "./subject.service";
import { FilterQuery } from "mongoose";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private taskRepository: TaskRepository,
    private subjectService: SubjectService
  ) {}

  async getAllTasks(userId: string) {
    try {
      return await this.taskRepository.find({ userId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getTaskById(taskId: string) {
    try {
      return await this.taskRepository.findOne({ _id: taskId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getWeeklyTasks(userId: string, start: Date) {
    try {
      // Create a Date object for the end of the week (next Sunday)
      const sundayDate = new Date(start);
      sundayDate.setDate(start.getDate() + 6); // Adding 6 days from Monday to get to Sunday
      sundayDate.setHours(23, 59, 59, 999); // Set to end of day

      const filterQuery: FilterQuery<Task> = {
        userId,
        startDate: {
          $gte: start, // startTime is greater than or equal to Monday
          $lte: sundayDate, // startTime is less than or equal to Sunday (end of the week)
        },
      };
      return await this.taskRepository.find(filterQuery);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async createTask(userId: string, taskData: Partial<Task>) {
    try {
      if (taskData.subjectId) {
        await this.subjectService.getSubjectById(taskData.subjectId);
      }
      return await this.taskRepository.create({ ...taskData, userId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async updateTask(taskId: string, updatedData: Partial<Task>) {
    try {
      if (updatedData.subjectId) {
        await this.subjectService.getSubjectById(updatedData.subjectId);
      }
      return await this.taskRepository.findOneAndUpate({ _id: taskId }, updatedData);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async deleteTask(taskId: string) {
    try {
      return await this.taskRepository.findOneAndDelete({ _id: taskId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}