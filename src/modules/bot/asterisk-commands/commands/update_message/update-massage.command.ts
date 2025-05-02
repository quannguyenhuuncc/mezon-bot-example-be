import { ChannelMessage, EButtonMessageStyle, EMarkdownType } from 'mezon-sdk';
import {
  BOT_BUTTON_ACTION_FEATURES,
  BOT_COMMANDS,
} from 'src/common/enums/bot.enum';
import { CommandBase } from '../../base/command.abstract';
import { Command } from '../../base/command-register.decorator';
import {
  generateButtonMessageComponents,
  generateChannelMessageContent,
  generateMessageRef,
} from 'src/common/utils/message';
import { MezonBotMessage } from 'src/modules/mezon/domain/entities/mezon-bot-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MezonService } from 'src/modules/mezon/mezon.service';
import { BotButtonIdPrefix } from 'src/common/constants';
import { Logger } from '@nestjs/common';

@Command(BOT_COMMANDS.UPDATE_MESSAGE)
@Command(BOT_COMMANDS.BUTTON_MESSAGE_COMPONENT)
export class UpdateMessageCommand extends CommandBase {
  private readonly logger = new Logger(UpdateMessageCommand.name);
  constructor(
    private clientService: MezonService,
    @InjectRepository(MezonBotMessage)
    private readonly messagessRepository: Repository<MezonBotMessage>,
  ) {
    super();
  }

  async execute(_: string[], message: ChannelMessage) {
    const msg = {
      ...generateChannelMessageContent({
        message: 'Old message',
        blockMessage: true,
      }),
      components: generateButtonMessageComponents({
        buttonGroups: [
          {
            buttons: [
              {
                id: [
                  BotButtonIdPrefix,
                  BOT_BUTTON_ACTION_FEATURES.UPDATE_MESSAGE_EXECUTE,
                ].join('_'),
                label: 'Update',
                style: EButtonMessageStyle.PRIMARY,
              },
            ],
          },
        ],
      }),
    };
    this.clientService
      .sendMessage({
        clan_id: message.clan_id!,
        channel_id: message.channel_id!,
        is_public: message.is_public!,
        mode: message.mode!,
        msg,
        ref: generateMessageRef(message),
      })
      .then(res => {
        this.messagessRepository.insert({
          messageId: res.message_id,
          clanId: message.clan_id,
          channelId: res.channel_id,
          userId: message.sender_id,
          isPublic: message.is_public,
          mode: message.mode,
          rawContent: JSON.stringify(msg),
          content: 'Old message',
        });
      });

    return [];
  }
}
