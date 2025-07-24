import { Test, TestingModule } from '@nestjs/testing';
import { NftGenerationService } from './nft-generation.service';

describe('NftGenerationService', () => {
  let service: NftGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftGenerationService],
    }).compile();

    service = module.get<NftGenerationService>(NftGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
