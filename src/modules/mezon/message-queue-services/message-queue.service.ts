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

  private async processDirectMessage(message: MessageForUser) {
    const dmChannel = await this.mezonService
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
      await this.mezonService.sendMessage({
        clan_id: message.clanId,
        channel_id: message.channelId,
        is_public: message.isPublic,
        mode: message.channelMode,
        msg: generateChannelMessageContent({
          message: message.contentText,
          blockMessage: message.type === EMarkdownType.TRIPLE,
        }),
        ref: message.refs,
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
