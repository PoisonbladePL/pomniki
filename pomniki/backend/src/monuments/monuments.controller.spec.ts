import { Test, TestingModule } from '@nestjs/testing';
import { MonumentsController } from './monuments.controller';

describe('MonumentsController', () => {
  let controller: MonumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonumentsController],
    }).compile();

    controller = module.get<MonumentsController>(MonumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
