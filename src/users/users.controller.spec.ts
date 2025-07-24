import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
    findUserById: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        walletAddress: 'test-wallet',
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedResponse: UserResponseDto = {
        id: 'user-id',
        walletAddress: createUserDto.walletAddress,
        profile: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
        },
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.createUser.mockResolvedValue(expectedResponse);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findUserById', () => {
    it('should return user by id', async () => {
      const userId = 'user-id';
      const expectedResponse: UserResponseDto = {
        id: userId,
        walletAddress: 'test-wallet',
        profile: {},
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findUserById.mockResolvedValue(expectedResponse);

      const result = await controller.findUserById(userId);

      expect(result).toEqual(expectedResponse);
      expect(service.findUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const userId = 'user-id';
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        email: 'jane@example.com',
      };

      const expectedResponse: UserResponseDto = {
        id: userId,
        walletAddress: 'test-wallet',
        profile: {
          firstName: updateUserDto.firstName,
          email: updateUserDto.email,
        },
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.updateUser.mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(userId, updateUserDto);

      expect(result).toEqual(expectedResponse);
      expect(service.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should return safety message', async () => {
      const userId = 'user-id';
      const expectedResponse = { message: 'User deletion not implemented for safety reasons' };

      const result = await controller.deleteUser(userId);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('smokeTest', () => {
    it('should return module status', async () => {
      const result = await controller.smokeTest();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
      expect(result.message).toBe('Users module is working correctly');
      expect(typeof result.timestamp).toBe('string');
    });
  });
});
