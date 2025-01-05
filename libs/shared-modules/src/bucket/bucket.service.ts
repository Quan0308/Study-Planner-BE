import { ConfirmUploadDto, UpdateFileDto, UploadFileDto } from "@app/types/dtos/buckets";
import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectS3, S3 } from "nestjs-s3";
import { Bucket } from "@app/database/entities";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ICurrentUser } from "@app/types/interfaces";
import { BucketPermissionsEnum, BucketUploadStatusEnum } from "@app/types/enum";
import _ from "lodash";
import { BucketRepository } from "@app/database/repositories/bucket.repository";

@Injectable()
export class BucketService {
  private logger = new Logger(this.constructor.name);
  private bucketName: string = "";

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly bucketRepository: BucketRepository,
    private readonly configService: ConfigService
  ) {
    this.bucketName = this.configService.get("BUCKET_NAME");
    this.logger.log(`Bucket name: ${this.bucketName}`);
  }

  async getPresignedUploadUrl(user: ICurrentUser, body: UploadFileDto) {
    try {
      const { name } = body;
      const data = await this.bucketRepository.create({
        name,
        owner: user.userId,
        permission: body.permission ? body.permission : BucketPermissionsEnum.PUBLIC,
      });
      this.logger.verbose(`Created bucket data: ${JSON.stringify(data)}`);
      const command = new PutObjectCommand({ Bucket: this.bucketName, Key: data._id.toString() });
      return {
        id: data._id.toString(),
        url: await getSignedUrl(this.s3, command, { expiresIn: 3600 }),
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getPresignedDownloadUrl(user: ICurrentUser, fileId: string) {
    try {
      const data = await this.bucketRepository.findOne({ _id: fileId });

      if (!data || data.uploadStatus === BucketUploadStatusEnum.PENDING) {
        throw new BadRequestException("File not found");
      }

      if (
        data.permission === BucketPermissionsEnum.PRIVATE &&
        data.owner !== user.userId
        // TODO: change role user.role !== AccountRoleEnum.ADMIN
      ) {
        throw new UnauthorizedException("Unauthorized access");
      }

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileId,
        ResponseContentDisposition: `inline; filename=${data.name}`,
      });

      return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getUserFiles(user: ICurrentUser) {
    try {
      return this.bucketRepository.find({ owner: user.userId });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getUserMostRecentFile(user: ICurrentUser) {
    try {
      return (
        await this.bucketRepository.findPaginate(
          { owner: user.userId, uploadStatus: BucketUploadStatusEnum.UPLOADED },
          { updatedAt: -1 } as any,
          1,
          1
        )
      )[0];
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async deleteFile(user: ICurrentUser, fileId: string) {
    try {
      const data = await this.bucketRepository.findOne({ _id: fileId });

      if (!data) {
        throw new BadRequestException("File not found");
      }

      // TODO: add Role enum if (data.owner !== user.userId && user.role !== AccountRoleEnum.ADMIN) {
      if (data.owner !== user.userId) {
        throw new UnauthorizedException("Unauthorized access");
      }

      const deletedData = await this.bucketRepository.findOneAndDelete({ _id: fileId });

      if (deletedData) {
        const command = new DeleteObjectCommand({ Bucket: this.bucketName, Key: fileId });
        await this.s3.send(command);
      }

      return { affected: 1 };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async cleanUserFiles(user: ICurrentUser) {
    try {
      const existingFiles = await this.bucketRepository.find({ owner: user.userId });
      for (const file of existingFiles) {
        const command = new DeleteObjectCommand({ Bucket: this.bucketName, Key: file._id.toString() });
        await this.s3.send(command);
      }
      this.logger.log(`Cleaned ${existingFiles.length} files for user ${user.userId}`);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async uploadConfirmation(user: ICurrentUser, body: ConfirmUploadDto) {
    try {
      const data = await this.bucketRepository.findOne({ _id: body.id });

      if (!data) {
        throw new BadRequestException("File not found");
      }

      if (data.owner !== user.userId) {
        throw new UnauthorizedException("Unauthorized access");
      }

      try {
        const command = new HeadObjectCommand({ Bucket: this.bucketName, Key: body.id });
        await this.s3.send(command);
      } catch (error) {
        throw new BadRequestException("File is not uploaded");
      }

      data.uploadStatus = BucketUploadStatusEnum.UPLOADED;
      await this.bucketRepository.findOneAndUpate({ _id: body.id }, data);

      return { id: data._id, name: data.name };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getPresignedUploadUrlForUpdate(user: ICurrentUser, body: UpdateFileDto & { id: string }) {
    try {
      const data = await this.bucketRepository.findOne({ _id: body.id });
      if (!data) {
        throw new BadRequestException("File not found");
      }

      if (data.owner !== user.userId) {
        throw new UnauthorizedException("Unauthorized access");
      }

      data.name = body.name ? body.name : data.name;
      data.permission = body.permission ? body.permission : data.permission;
      await this.bucketRepository.findOneAndUpate({ _id: body.id }, data);

      const command = new PutObjectCommand({ Bucket: this.bucketName, Key: data._id.toString() });
      return {
        id: data._id,
        url: await getSignedUrl(this.s3, command, { expiresIn: 3600 }),
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getPresignedDownloadUrlForAfterLoad(entity: Bucket) {
    try {
      if (_.isNil(entity._id.toString())) {
        return null;
      }
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: entity._id.toString(),
        ResponseContentDisposition: `inline; filename=${entity.name}`,
      });

      return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
