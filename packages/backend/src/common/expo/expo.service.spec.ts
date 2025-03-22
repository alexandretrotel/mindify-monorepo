import { Test, TestingModule } from '@nestjs/testing';
import { ExpoService } from './expo.service';
import { ConfigService } from '@nestjs/config';

describe('ExpoService', () => {
  let service: ExpoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpoService, ConfigService],
    }).compile();

    service = module.get<ExpoService>(ExpoService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
