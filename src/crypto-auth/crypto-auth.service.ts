import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import { AuthVerifyDto } from './dto/auth-verify.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';

@Injectable()
export class CryptoAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async requestAuth(authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
    let user;
    
    try {
      user = await this.usersService.findUserByWalletAddress(authRequestDto.walletAddress);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Create new user if not exists
        const createUserDto: CreateUserDto = {
          walletAddress: authRequestDto.walletAddress,
        };
        const newUser = await this.usersService.createUser(createUserDto);
        user = await this.usersService.findUserByWalletAddress(authRequestDto.walletAddress);
      } else {
        throw error;
      }
    }

    const nonce = await this.usersService.generateNonceForUser(authRequestDto.walletAddress);
    const message = this.createAuthMessage(authRequestDto.walletAddress, nonce);

    return {
      accessToken: null,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
      },
      message,
    };
  }

  async verifyAuth(authVerifyDto: AuthVerifyDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findUserByWalletAddress(authVerifyDto.walletAddress);
    
    if (!this.verifySignature(authVerifyDto)) {
      throw new UnauthorizedException('Invalid signature');
    }

    if (!this.verifyMessage(authVerifyDto.message, user.walletAddress, user.nonce)) {
      throw new UnauthorizedException('Invalid message or nonce');
    }

    // Update last login and verify user
    await this.usersService.updateLastLogin(user.id);
    if (!user.isVerified) {
      await this.usersService.verifyUser(user.id);
    }

    const payload = {
      sub: user.id,
      walletAddress: user.walletAddress,
      isVerified: user.isVerified,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
      },
    };
  }

  private createAuthMessage(walletAddress: string, nonce: string): string {
    const timestamp = Date.now();
    return `Sign this message to authenticate with MediChain\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
  }

  private verifySignature(authVerifyDto: AuthVerifyDto): boolean {
    try {
      const publicKeyBytes = bs58.decode(authVerifyDto.walletAddress);
      const signatureBytes = bs58.decode(authVerifyDto.signature);
      const messageBytes = new TextEncoder().encode(authVerifyDto.message);

      return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    } catch (error) {
      return false;
    }
  }

  private verifyMessage(message: string, walletAddress: string, nonce: string): boolean {
    const expectedMessage = this.createAuthMessage(walletAddress, nonce);
    return message === expectedMessage;
  }
}
