import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BotService } from './bot.service';
import { SendMessageDto } from './dto/send-message.dto';
@ApiTags('bot')
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('send-message-to-channel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Send message to channel',
    description: 'Sends a message to a specified channel with markdown support',
  })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message successfully sent to the channel',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input parameters',
  })
  async sendMessageToChannel(
    @Body() messageData: SendMessageDto,
  ): Promise<void> {
    await this.botService.sendMessage(messageData);
  }
}
