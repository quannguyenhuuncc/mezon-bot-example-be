import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events, ChannelMessage } from 'mezon-sdk';
import { BOT_CONFIG } from 'src/common/enums/bot.enum';
import { ConfigService } from 'src/modules/config/config.service';

@Injectable()
export class EventListenerChannelMessage {
  constructor(private readonly configService: ConfigService) {}

  @OnEvent(Events.ChannelMessage)
  async handleCommand(message: ChannelMessage) {
    if (this.shouldSkipMessage(message)) return;
    const messageContent = message.content.t;
    if (messageContent) {
      //   this.messageQueue.addMessages(
      // (await this.asterisk.execute(messageContent, message)) || [],
      //   );
    }
  }

  private shouldSkipMessage(message: ChannelMessage): boolean {
    if (message.code) return true;

    const messageContent = message.content?.t?.trim();
    return (
      !messageContent ||
      !this.configService
        .get(BOT_CONFIG.COMMAND_PREFIX, ['*'])
        .some(prefix => messageContent.startsWith(prefix))
    );
  }
}
