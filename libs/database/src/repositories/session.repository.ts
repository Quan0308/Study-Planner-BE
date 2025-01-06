import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { AbstractRepository } from "./abstract.repository";
import { Session } from "../entities";

@Injectable()
export class SessionRepository extends AbstractRepository<Session> {
  protected readonly logger = new Logger(SessionRepository.name);
  constructor(@InjectModel(Session.name) requestModel: Model<Session>) {
    super(requestModel);
  }

  async getSessionWithHistory(filterQuery: FilterQuery<Session>) {
    return this.model.find(filterQuery).sort({
      createdAt: "desc",
    });
  }
}
