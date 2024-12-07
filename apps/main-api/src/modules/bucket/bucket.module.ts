import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Module } from "nestjs-s3";
import { BucketController } from "./bucket.controller";
import { BucketService } from "./bucket.service";
import { DatabaseModule } from "@app/database";
import { BucketRepository } from "@app/database/repositories/bucket.repository";
import { Bucket, BucketSchema } from "@app/database/entities";
import { FirebaseModule } from "@app/shared-modules/firebase";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          credentials: {
            accessKeyId: configService.get("BUCKET_ACCESS_KEY_ID"),
            secretAccessKey: configService.get("BUCKET_SECRET_ACCESS_KEY"),
          },
          // bucketEndpoint: true,
          forcePathStyle: false,
          region: "us-east-1",
          endpoint: configService.get("BUCKET_ENDPOINT"),
        },
      }),
    }),
    DatabaseModule.forFeature([
      {
        name: Bucket.name,
        schema: BucketSchema,
      },
    ]),
    FirebaseModule,
  ],
  controllers: [BucketController],
  providers: [BucketService, BucketRepository],
  exports: [BucketService],
})
export class BucketModule {}
