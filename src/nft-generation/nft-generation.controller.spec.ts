import { Test, TestingModule } from '@nestjs/testing';
import { NftGenerationController } from './nft-generation.controller';

describe('NftGenerationController', () => {
  let controller: NftGenerationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftGenerationController],
    }).compile();

    controller = module.get<NftGenerationController>(NftGenerationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
