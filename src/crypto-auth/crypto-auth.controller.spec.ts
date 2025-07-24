import { Test, TestingModule } from '@nestjs/testing';
import { CryptoAuthController } from './crypto-auth.controller';

describe('CryptoAuthController', () => {
  let controller: CryptoAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoAuthController],
    }).compile();

    controller = module.get<CryptoAuthController>(CryptoAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
