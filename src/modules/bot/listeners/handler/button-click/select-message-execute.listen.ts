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
export class SelectMessageExcuteListener {
  private readonly logger = new Logger(SelectMessageExcuteListener.name);

  constructor(
    @InjectRepository(MezonBotMessage)
    private readonly messagessRepository: Repository<MezonBotMessage>,
  ) { }

  @OnEvent(BOT_BUTTON_ACTION_FEATURES.SELECT_MESSAGE_COMPONENT_EXECUTE)
  async handleMessageButtonClick(payload: {
    payload: ButtonClickPayload;
    params: string[];
  }) {
    const {
      payload: { message_id },
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

    const selection = (
      message.rawContent as {
        components: {
          components: {
            id: string;
          }[];
        }[];
      }
    ).components.find(
      component =>
        component.components.find(component =>
          component.id.includes(message_id),
        ) || true,
    );

    this.logger.log(`Message: ${JSON.stringify(selection, null, 2)}`);

    // this.logger.log(`Message: ${JSON.stringify(selection, null, 2)}`);
    // this.logger.log(`Message: ${JSON.stringify({}),null,2 }`);

    // const user = await this.usersRepository.findOne({
    //   where: {
    //     userId: user_id,
    //   },
    // });
    // this.mezonService
    //   .updateChatMessage({
    //     channel_id: message.channelId,
    //     clan_id: message.clanId,
    //     message_id: message_id,
    //     content: generateChannelMessageContent({
    //       message: (user?.displayName ?? user_id) + ' updated message',
    //       blockMessage: true,
    //     }),
    //     is_public: message.isPublic,
    //     mode: message.mode,
    //     hideEditted: true,
    //   })
    //   .catch(res => {
    //     this.logger.error('ERROR:' + JSON.stringify(res, null, 2));
    //   });
  }
}
