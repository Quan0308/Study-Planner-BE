import { Test, TestingModule } from '@nestjs/testing';
import { MainApiController } from './main-api.controller';
import { MainApiService } from './main-api.service';

describe('MainApiController', () => {
  let mainApiController: MainApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MainApiController],
      providers: [MainApiService],
    }).compile();

    mainApiController = app.get<MainApiController>(MainApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mainApiController.getHello()).toBe('Hello World!');
    });
  });
});
