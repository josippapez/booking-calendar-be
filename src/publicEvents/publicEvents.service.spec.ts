import { Test, TestingModule } from '@nestjs/testing';
import { PublicEventsService } from './publicEvents.service';

describe('PublicEventsService', () => {
  let service: PublicEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicEventsService],
    }).compile();

    service = module.get<PublicEventsService>(PublicEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
