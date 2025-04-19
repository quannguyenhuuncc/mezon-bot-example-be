// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard'; // Add this import
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserAuthResponseDto } from '../users/dto/user-auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Request() req): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile',
    type: UserAuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getProfile(@Request() req): UserAuthResponseDto {
    // Only include essential user information
    const { id, email, firstName, lastName } = req.user;
    return new UserAuthResponseDto({ id, email, firstName, lastName });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile',
    type: UserAuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getProfile1(@Request() req): UserAuthResponseDto {
    // Only include essential user information
    const { id, email, firstName, lastName } = req.user;
    return new UserAuthResponseDto({ id, email, firstName, lastName });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@Request() req) {
    const result = await this.authService.logout(req.user.id);
    return { success: result };
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refresh successful',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  async refreshTokens(@Request() req) {
    try {
      if (!req.user?.sub) {
        throw new BadRequestException('Invalid token payload');
      }

      const userId = req.user.sub;
      const refreshToken = req.body.refreshToken;

      return this.authService.refreshTokens(userId, refreshToken);
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw error; // Re-throw to let NestJS handle the error response
    }
  }
}
