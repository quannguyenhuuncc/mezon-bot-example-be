import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ConfigValueType } from '../domain/entities/config.entity';

@Exclude()
export class ConfigResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  key: string;

  @Expose()
  @ApiProperty()
  type: ConfigValueType;

  @Expose()
  @ApiProperty()
  jsonValue: string;

  @Expose()
  @ApiProperty()
  value: unknown;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<ConfigResponseDto>) {
    Object.assign(this, partial);
  }
}
