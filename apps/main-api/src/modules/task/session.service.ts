import { SessionRepository, TaskRepository } from "@app/database/repositories";
import { CreateSessionDto, UpdateSessionDto } from "@app/types/dtos/sessions";
import { SessionStatus } from "@app/types/enum";
import { ICurrentUser } from "@app/types/interfaces";
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";

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
}
