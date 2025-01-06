import { Session } from "@app/database/entities";
import { SessionRepository, TaskRepository } from "@app/database/repositories";
import { CreateSessionDto, UpdateSessionDto } from "@app/types/dtos/sessions";
import { SessionStatus } from "@app/types/enum";
import { ICurrentUser } from "@app/types/interfaces";
import get6DaysFromDate from "@app/utils/datetime/datetime";
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery } from "mongoose";

@Injectable()
export class SessionService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly taskRepository: TaskRepository
  ) {}

  async createNewSession(data: CreateSessionDto, user: ICurrentUser) {
    try {
      const { userId } = user;
      await this.taskRepository.findOne({ _id: { $in: data.taskIds }, userId });
      return this.sessionRepository.create({ ...data, userId });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException("Invalid task");
      }
      throw new BadRequestException(error);
    }
  }

  async updateExistedSession(_id: string, data: UpdateSessionDto, user: ICurrentUser) {
    try {
      const { userId } = user;
      const currentSession = await this.sessionRepository.findOne({ _id, userId, status: SessionStatus.ACTIVE });
      if (data.status === SessionStatus.COMPLETED || SessionStatus.CANCELED) {
        data["trueDuration"] = (new Date().getTime() - currentSession["createdAt"].getTime()) / 1000;
      }

      await this.sessionRepository.findOneAndUpate({ _id }, { ...data });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException("Invalid session");
      }
      throw new BadRequestException(error);
    }
  }

  async getSessionHistory(user: ICurrentUser, from?: Date, to?: Date, status?: string | string[]) {
    try {
      const { userId } = user;
      const filter: FilterQuery<Session> = {};
      filter.userId = userId;

      if (from) {
        filter.createdAt = { $gte: from };
        if (to) {
          if (to < from) {
            throw new BadRequestException("to must be after from");
          }
          const endOfDay = new Date(to);
          endOfDay.setHours(23, 59, 59, 999);
          filter.createdAt = { ...filter.createdAt, $lt: endOfDay };
        } else {
          const endOf6thDay = get6DaysFromDate(from);
          endOf6thDay.setHours(23, 59, 59, 999);
          filter.createdAt = { ...filter.createdAt, $lt: endOf6thDay };
        }
      } else if (to) {
        throw new BadRequestException("from is required when to is provided");
      }

      if (status) {
        filter.status = Array.isArray(status) ? { $in: status } : status;
      }

      const data = await this.sessionRepository.getSessionWithHistory(filter);
      return data;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
