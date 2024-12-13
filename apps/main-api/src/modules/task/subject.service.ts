import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { SubjectRepository, TaskRepository } from "@app/database/repositories";
import { Subject } from "@app/database/entities";

@Injectable()
export class SubjectService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private subjectRepository: SubjectRepository,
    private taskRepository: TaskRepository
  ) {}

  async getSubjectById(subjectId: string) {
    try {
      return await this.subjectRepository.findOne({ _id: subjectId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getAllSubjectsByUserId(userId: string) {
    try {
      return await this.subjectRepository.find({ userId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async createSubject(userId: string, subjectData: Partial<Subject>) {
    try {
      return await this.subjectRepository.create({ ...subjectData, userId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async updateSubject(subjectId: string, updatedData: Partial<Subject>) {
    try {
      return await this.subjectRepository.findOneAndUpate({ _id: subjectId }, updatedData);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async deleteSubject(subjectId: string) {
    try {
      const relatedTasks = await this.taskRepository.find({ subjectId });
      if (relatedTasks.length > 0) {
        throw new BadRequestException("Cannot delete subject with related tasks");
      }
      return await this.subjectRepository.findOneAndDelete({ _id: subjectId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
