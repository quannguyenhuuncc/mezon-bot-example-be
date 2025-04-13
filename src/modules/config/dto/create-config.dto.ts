import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ConfigValueType } from '../domain/entities/config.entity';

export class CreateConfigDto {
  @ApiProperty({
    description: 'Unique identifier for the configuration',
    example: 'app.settings.theme',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    enum: ConfigValueType,
    description: 'Data type of the configuration value',
    example: ConfigValueType.STRING,
  })
  @IsEnum(ConfigValueType)
  @IsNotEmpty()
  type: ConfigValueType;

  @ApiProperty({
    description: 'Value of the configuration in any supported type',
    example: 'dark',
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'object', properties: { example: { type: 'string' } } },
      { type: 'array', items: { type: 'string' } },
      { type: 'date', format: 'date-time' },
    ],
    additionalProperties: true,
  })
  value: unknown;

  @ApiProperty({
    description: 'Indicates if this configuration is active',
    example: true,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Human-readable description of the configuration',
    example: 'Application theme setting',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
