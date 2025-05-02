import { BaseEntity } from 'src/common/base.entity';
import { BOT_TABLES } from 'src/common/enums/bot.enum';
import { EMessageMode } from 'src/common/enums/mezon.enum';
import {
  Column,
  Entity,
  Index,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Index(['clanId', 'messageId', 'channelId', 'userId'])
@Entity(BOT_TABLES.BOT_MESSAGE)
export class MezonBotMessage extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  messageId: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  channelId: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  clanId: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'text', nullable: true })
  @Exclude()
  content: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'text', nullable: true })
  @Exclude()
  jsonRawContent: string;

  rawContent: unknown;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({
    type: 'enum',
    enum: EMessageMode,
    default: EMessageMode.CHANNEL_MESSAGE,
  })
  mode: EMessageMode;

  @IsString()
  @IsOptional()
  @Column({ type: 'text', nullable: true })
  @Exclude()
  jsonAdditionalInfo: string;

  additionalInfo: unknown;

  @AfterLoad()
  deserializeValues() {
    try {
      this.rawContent = this.jsonRawContent
        ? JSON.parse(this.jsonRawContent)
        : null;
      this.additionalInfo = this.jsonAdditionalInfo
        ? JSON.parse(this.jsonAdditionalInfo)
        : null;
    } catch (e) {
      this.rawContent = this.jsonRawContent;
      this.additionalInfo = this.jsonAdditionalInfo;
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  serializeValues() {
    console.log('serializeValues' + JSON.stringify(this.rawContent));
    if (this.rawContent !== undefined) {
      this.jsonRawContent = JSON.stringify(this.rawContent);
    }
    if (this.additionalInfo !== undefined) {
      this.jsonAdditionalInfo = JSON.stringify(this.additionalInfo);
    }
  }
}
