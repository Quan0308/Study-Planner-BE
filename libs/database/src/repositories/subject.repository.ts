import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "./abstract.repository";
import { Subject } from "../entities";

@Injectable()
export class SubjectRepository extends AbstractRepository<Subject> {
  protected readonly logger = new Logger(SubjectRepository.name);
  constructor(@InjectModel(Subject.name) subjectModel: Model<Subject>) {
    super(subjectModel);
  }
}
