import { Module } from '@nestjs/common';
import { MainApiController } from './main-api.controller';
import { MainApiService } from './main-api.service';

@Module({
  imports: [],
  controllers: [MainApiController],
  providers: [MainApiService],
})
export class MainApiModule {}
