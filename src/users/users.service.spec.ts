import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        walletAddress: 'test-wallet-address',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const mockUser = {
        id: 'user-id',
        walletAddress: createUserDto.walletAddress,
        profile: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
        },
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual({
        id: mockUser.id,
        walletAddress: mockUser.walletAddress,
        profile: mockUser.profile,
        isVerified: mockUser.isVerified,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw ConflictException if user with wallet address already exists', async () => {
      const createUserDto: CreateUserDto = {
        walletAddress: 'existing-wallet-address',
      };

      mockRepository.findOne.mockResolvedValue({ id: 'existing-user' });

      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findUserById', () => {
    it('should return user if found', async () => {
      const mockUser = {
        id: 'user-id',
        walletAddress: 'test-wallet',
        profile: {},
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserById('user-id');

      expect(result).toEqual({
        id: mockUser.id,
        walletAddress: mockUser.walletAddress,
        profile: mockUser.profile,
        isVerified: mockUser.isVerified,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findUserById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserByWalletAddress', () => {
    it('should return user if found', async () => {
      const mockUser = {
        id: 'user-id',
        walletAddress: 'test-wallet',
        profile: {},
        isVerified: false,
        nonce: 'test-nonce',
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByWalletAddress('test-wallet');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findUserByWalletAddress('non-existent-wallet')).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateNonceForUser', () => {
    it('should generate nonce and update user', async () => {
      const mockUser = {
        id: 'user-id',
        walletAddress: 'test-wallet',
        nonce: 'old-nonce',
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, nonce: 'new-nonce' });

      const result = await service.generateNonceForUser('test-wallet');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
