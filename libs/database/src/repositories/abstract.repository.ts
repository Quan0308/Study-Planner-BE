import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";
import { Model, Types, FilterQuery, UpdateQuery } from "mongoose";
import { AbstractEntity } from "../entities/abstract.entity";

export type SortOptions<T> = {
  [P in keyof T]?: "asc" | "desc";
};

export abstract class AbstractRepository<T extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<T>) {}

  async create(document: Partial<T>): Promise<T> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save()).toJSON() as unknown as T;
  }

  async findPaginate(
    filterQuery: FilterQuery<T>,
    sortOptions: SortOptions<T>,
    page: number,
    limit: number
  ): Promise<T[]> {
    try {
      const documents = await this.model
        .find(filterQuery)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<T[]>();
      return documents;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(filterQuery: FilterQuery<T>, returnedNull: boolean = false): Promise<T> {
    const document = await this.model.findOne(filterQuery).lean<T>();

    if (!document && !returnedNull) {
      this.logger.warn("Document was not found with filterQuery", filterQuery);
      throw new NotFoundException("Document not found");
    }
    return document;
  }

  async findOneAndUpate(filterQuery: FilterQuery<T>, update: UpdateQuery<T>): Promise<T> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<T>();

    if (!document) {
      this.logger.warn("Document was not found with filterQuery", filterQuery);
      throw new NotFoundException("Document not found");
    }
    return document;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filterQuery).lean<T[]>();
  }

  async count(filterQuery: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filterQuery);
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    return this.model.findOneAndDelete(filterQuery).lean<T>();
  }

  async findAllAndUpdate(filterQuery: FilterQuery<T>, update: UpdateQuery<T>): Promise<number> {
    const result = await this.model.updateMany(filterQuery, update);
    return result.modifiedCount;
  }
}
