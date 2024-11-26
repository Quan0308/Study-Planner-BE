import { Controller, Get } from '@nestjs/common';
import { MainApiService } from './main-api.service';

@Controller()
export class MainApiController {
  constructor(private readonly mainApiService: MainApiService) {}

  @Get()
  getHello(): string {
    return this.mainApiService.getHello();
  }
}
