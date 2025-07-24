import { Test, TestingModule } from '@nestjs/testing';
import { CryptoAuthService } from './crypto-auth.service';

describe('CryptoAuthService', () => {
  let service: CryptoAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoAuthService],
    }).compile();

    service = module.get<CryptoAuthService>(CryptoAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
