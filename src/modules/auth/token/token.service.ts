// src/modules/auth/token/token.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { TokenResponse } from '../interfaces/token-response.interface';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async generateTokens(userId: string, email: string): Promise<TokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, email),
      this.generateRefreshToken(userId, email),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(userId: string, email: string): Promise<string> {
    const payload: TokenPayload = {
      sub: userId,
      email,
      type: 'access',
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwtSecret'),
      expiresIn: `${this.configService.get<number>('app.jwtExpirationTime')}s`,
    });
  }

  async generateRefreshToken(userId: string, email: string): Promise<string> {
    const payload: TokenPayload = {
      sub: userId,
      email,
      type: 'refresh',
      jti: uuidv4(), // Unique token ID for potential blacklisting
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwtRefreshSecret'),
      expiresIn: `${this.configService.get<number>('app.jwtRefreshExpirationTime')}s`,
    });
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedToken = await bcrypt.hash(refreshToken, salt);

    await this.usersService.updateRefreshToken(userId, hashedToken);
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.usersService.findOneWithRefreshToken(userId);

    if (!user?.refreshToken) {
      return false;
    }

    return bcrypt.compare(refreshToken, user.refreshToken);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
