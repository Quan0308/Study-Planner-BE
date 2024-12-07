import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "./abstract.repository";
import { Bucket } from "../entities";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BucketRepository extends AbstractRepository<Bucket> {
  protected readonly logger = new Logger(BucketRepository.name);
  constructor(@InjectModel(Bucket.name) bucketModel: Model<Bucket>) {
    super(bucketModel);
  }
}
