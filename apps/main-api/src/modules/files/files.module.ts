import { BucketModule } from "@app/shared-modules/bucket/bucket.module";
import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";

@Module({
  imports: [BucketModule],
  controllers: [FilesController],
})
export class FilesModule {}
