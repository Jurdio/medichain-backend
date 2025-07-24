import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { walletAddress: createUserDto.walletAddress },
    });

    if (existingUser) {
      throw new ConflictException('User with this wallet address already exists');
    }

    const user = this.userRepository.create({
      walletAddress: createUserDto.walletAddress,
      profile: {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        phone: createUserDto.phone,
        dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : undefined,
      },
      nonce: this.generateNonce(),
    });

    const savedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(savedUser);
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapToResponseDto(user);
  }

  async findUserByWalletAddress(walletAddress: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { walletAddress } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.walletAddress && updateUserDto.walletAddress !== user.walletAddress) {
      const existingUser = await this.userRepository.findOne({
        where: { walletAddress: updateUserDto.walletAddress },
      });
      if (existingUser) {
        throw new ConflictException('User with this wallet address already exists');
      }
    }

    const updatedProfile = {
      ...user.profile,
      ...(updateUserDto.firstName && { firstName: updateUserDto.firstName }),
      ...(updateUserDto.lastName && { lastName: updateUserDto.lastName }),
      ...(updateUserDto.email && { email: updateUserDto.email }),
      ...(updateUserDto.phone && { phone: updateUserDto.phone }),
      ...(updateUserDto.dateOfBirth && { dateOfBirth: new Date(updateUserDto.dateOfBirth) }),
    };

    Object.assign(user, {
      ...(updateUserDto.walletAddress && { walletAddress: updateUserDto.walletAddress }),
      profile: updatedProfile,
    });

    const savedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(savedUser);
  }

  async generateNonceForUser(walletAddress: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { walletAddress } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const nonce = this.generateNonce();
    user.nonce = nonce;
    await this.userRepository.save(user);

    return nonce;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLoginAt: new Date() });
  }

  async verifyUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isVerified: true });
  }

  private generateNonce(): string {
    return randomBytes(32).toString('hex');
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      walletAddress: user.walletAddress,
      profile: user.profile,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
