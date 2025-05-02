import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { BOT_BUTTON_ACTION_FEATURES } from 'src/common/enums/bot.enum';
import { generateChannelMessageContent } from 'src/common/utils/message';
import { MezonBotMessage } from 'src/modules/mezon/domain/entities/mezon-bot-message.entity';
import { MezonUser } from 'src/modules/mezon/domain/entities/mezon-user.entity';
import { MezonService } from 'src/modules/mezon/mezon.service';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateMessageExcuteListener {
  private readonly logger = new Logger(UpdateMessageExcuteListener.name);

  constructor(
    private mezonService: MezonService,
    @InjectRepository(MezonBotMessage)
    private readonly messagessRepository: Repository<MezonBotMessage>,
    @InjectRepository(MezonUser)
    private readonly usersRepository: Repository<MezonUser>,
  ) {}

  @OnEvent(BOT_BUTTON_ACTION_FEATURES.UPDATE_MESSAGE_EXECUTE)
  async handleMessageButtonClick(payload: {
    payload: ButtonClickPayload;
    params: string[];
  }) {
    const {
      payload: { channel_id, message_id, user_id },
    } = payload;

    const message = await this.messagessRepository.findOne({
      where: {
        messageId: message_id,
      },
    });

    if (!message) {
      this.logger.warn(`Message with id ${message_id} not found`);
      return;
    }

    const user = await this.usersRepository.findOne({
      where: {
        userId: user_id,
      },
    });
    this.mezonService
      .updateChatMessage({
        channel_id: message.channelId,
        clan_id: message.clanId,
        message_id: message_id,
        content: generateChannelMessageContent({
          message: (user?.displayName ?? user_id) + ' updated message',
          blockMessage: true,
        }),
        is_public: message.isPublic,
        mode: message.mode,
        hideEditted: true,
      })
      .catch(res => {
        this.logger.error('ERROR:' + JSON.stringify(res, null, 2));
      });
  }
}
