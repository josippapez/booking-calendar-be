import { Test, TestingModule } from '@nestjs/testing';
import { PublicEventsController } from './publicEvents.controller';
import { PublicEventsService } from './publicEvents.service';

describe('PublicEventsController', () => {
  let controller: PublicEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicEventsController],
      providers: [PublicEventsService],
    }).compile();

    controller = module.get<PublicEventsController>(PublicEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
