import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Request } from "../entities";
import { AbstractRepository } from "./abstract.repository";

@Injectable()
export class RequestRepository extends AbstractRepository<Request> {
  protected readonly logger = new Logger(RequestRepository.name);
  constructor(@InjectModel(Request.name) requestModel: Model<Request>) {
    super(requestModel);
  }
}
