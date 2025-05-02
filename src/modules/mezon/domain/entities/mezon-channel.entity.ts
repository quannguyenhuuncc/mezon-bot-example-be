import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../../../common/base.entity';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EMessageMode } from '../../../../common/enums/mezon.enum';
import { BOT_TABLES } from 'src/common/enums/bot.enum';

@Entity(BOT_TABLES.CHANNELS)
export class Channel extends BaseEntity {
  @PrimaryColumn({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  channelId: string;

  @Column({ type: 'text' })
  @IsString()
  clanId: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @Exclude()
  @IsOptional()
  @IsString()
  name: string;

  @Column({
    type: 'enum',
    enum: EMessageMode,
    nullable: true,
  })
  @Exclude()
  @IsOptional()
  type: EMessageMode;

  @Column({
    type: 'boolean',
    default: true,
  })
  @Exclude()
  @IsBoolean()
  isActive: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Exclude()
  @IsBoolean()
  isPublic: boolean;
}
