import { Injectable } from '@nestjs/common';
import { MezonService } from '../mezon.service';
import { MessageQueueStore } from './message-queue-store.service';
import { generateChannelMessageContent } from 'src/common/utils/message';
import { EMarkdownType } from 'mezon-sdk';

@Injectable()
export class MessageQueueService {
  constructor(
    private readonly mezonService: MezonService,
    private readonly messageQueueStore: MessageQueueStore,
  ) {
    this.startMessageProcessor();
  }

  private processDirectMessage(message: MessageForUser) {
    return this.mezonService
      .getClient()
      .createDMchannel(message.mezonUserId!)
      .then(dmChannel => {
        if (!dmChannel?.channel_id) return;
        this.mezonService.sendMessageToUser({
          channelDmId: dmChannel.channel_id,
          textContent: message.contentText,
        });
        return dmChannel;
      })
      .catch(error => {
        console.error('Error sending direct message:', error);
        return null;
      });

    // TODO: add support for direct messages
  }

  private async processChannelMessage(message: MessageForChannel) {
    try {
      const {
        embed,
        components,
        contentText,
        type,
        clanId,
        channelId,
        isPublic,
        channelMode,
        refs,
      } = message;
      await this.mezonService.sendMessage({
        clan_id: clanId,
        channel_id: channelId,
        is_public: isPublic,
        mode: channelMode,
        msg: {
          ...generateChannelMessageContent({
            message: contentText,
            blockMessage: type === EMarkdownType.TRIPLE,
          }),
          embed: embed,
          components: components,
        },
        ref: refs,
      });
    } catch (error) {
      console.error('Error sending channel message:', error);
    }
  }

  private async processNextMessage() {
    if (!this.messageQueueStore.hasMessages()) return;
    const message = this.messageQueueStore.getNextMessage();
    if (!message) return;

    if ('mezonUserId' in message) {
      await this.processDirectMessage(message as MessageForUser);
    } else {
      await this.processChannelMessage(message as MessageForChannel);
    }
  }

  private startMessageProcessor() {
    setInterval(async () => {
      await this.processNextMessage();
    }, 50);
  }
}
