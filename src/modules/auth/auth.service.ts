// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { TokenService } from './token/token.service';
import { User } from '../users/domain/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password' | 'refreshToken'> | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      const isPasswordValid = await this.verifyPassword(
        password,
        user.password,
      );

      if (isPasswordValid) {
        const { password, refreshToken, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async login(user: LoginDto & { id: string }): Promise<AuthResponseDto> {
    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    await this.tokenService.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: new UserResponseDto(user),
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponseDto> {
    // Validate refresh token
    const isValid = await this.tokenService.validateRefreshToken(
      userId,
      refreshToken,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get user data for response
    const user = await this.usersService.findOne(userId);

    // Generate new tokens
    const tokens = await this.tokenService.generateTokens(userId, user.email);

    // Store new refresh token
    await this.tokenService.storeRefreshToken(userId, tokens.refreshToken);

    return {
      ...tokens,
      user: user,
    };
  }

  async logout(userId: string): Promise<boolean> {
    await this.tokenService.deleteRefreshToken(userId);
    return true;
  }
}
