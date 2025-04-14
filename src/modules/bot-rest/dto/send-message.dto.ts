import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { EMarkdownType } from 'mezon-sdk';

export class SendMessageDto {
  @ApiProperty({
    description: 'Channel ID where the message will be sent',
    example: '987654321',
  })
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @ApiProperty({
    description: 'MarkdownType',
    enum: EMarkdownType,
    example: EMarkdownType.SINGLE,
  })
  @IsNotEmpty()
  @IsEnum(EMarkdownType)
  markdownType: EMarkdownType;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, this is a message from the bot!',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
