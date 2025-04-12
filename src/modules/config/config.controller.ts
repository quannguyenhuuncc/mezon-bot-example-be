import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from './config.service';
import { ConfigResponseDto } from './dto/config-response.dto';
import { CreateConfigDto } from './dto/create-config.dto';

@ApiTags('config')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all configs' })
  @ApiResponse({
    status: 200,
    description: 'List of configs',
    type: [ConfigResponseDto],
  })
  getAllConfigs() {
    return this.configService.getAllConfigs();
  }

  @Get(':key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get config by key' })
  @ApiParam({ name: 'key', description: 'Config key' })
  @ApiResponse({
    status: 200,
    description: 'Config details',
    type: ConfigResponseDto,
  })
  getConfigByKey(@Param('key') key: string) {
    return this.configService.getConfigByKey(key);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new config' })
  @ApiBody({ type: CreateConfigDto })
  @ApiResponse({
    status: 201,
    description: 'Config created successfully',
    type: ConfigResponseDto,
  })
  createConfig(@Body() createConfigDto: CreateConfigDto) {
    return this.configService.createConfig(createConfigDto);
  }

  @Put(':key/value')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update config value' })
  @ApiParam({ name: 'key', description: 'Config key' })
  @ApiResponse({
    status: 200,
    description: 'Config updated successfully',
    type: ConfigResponseDto,
  })
  updateConfigValue(@Param('key') key: string, @Body('value') value: unknown) {
    return this.configService.updateConfigValue(key, value);
  }

  @Put(':key/active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update config active status' })
  @ApiParam({ name: 'key', description: 'Config key' })
  @ApiResponse({
    status: 200,
    description: 'Config active status updated successfully',
    type: ConfigResponseDto,
  })
  updateConfigActive(
    @Param('key') key: string,
    @Body('active') active: boolean,
  ) {
    return this.configService.updateConfigActive(key, active);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete config' })
  @ApiParam({ name: 'key', description: 'Config key' })
  @ApiResponse({
    status: 200,
    description: 'Config deleted successfully',
  })
  deleteConfig(@Param('key') key: string) {
    return this.configService.deleteConfig(key);
  }
}
