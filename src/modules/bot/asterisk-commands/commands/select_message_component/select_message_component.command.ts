import { ChannelMessage } from 'mezon-sdk';
import {
  BOT_BUTTON_ACTION_FEATURES,
  BOT_COMMANDS,
} from 'src/common/enums/bot.enum';
import { CommandBase } from '../../base/command.abstract';
import { Command } from '../../base/command-register.decorator';
import {
  generateChannelMessageContent,
  generateReplyMessage,
  generateSelectMessageComponents,
  generateMessageRef,
} from 'src/common/utils/message';
import { Logger } from '@nestjs/common';
import { MezonService } from 'src/modules/mezon/mezon.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MezonBotMessage } from 'src/modules/mezon/domain/entities/mezon-bot-message.entity';
import { Repository } from 'typeorm';
import { BotSelectionIdPrefix } from 'src/common/constants';

@Command(BOT_COMMANDS.SELECT_MESSAGE_COMPONENT)
export class SelectMessageComponentCommand extends CommandBase {
  private readonly logger = new Logger(SelectMessageComponentCommand.name);
  constructor(
    private clientService: MezonService,
    @InjectRepository(MezonBotMessage)
    private readonly messagessRepository: Repository<MezonBotMessage>,
  ) {
    super();
  }

  async execute(_: string[], message: ChannelMessage) {
    const msg = {
      ...generateReplyMessage({ messageContent: 'Select', msg: message }),
      components: [
        ...generateSelectMessageComponents({
          selects: [
            {
              id: [
                BotSelectionIdPrefix,
                BOT_BUTTON_ACTION_FEATURES.SELECT_MESSAGE_COMPONENT_EXECUTE,
                message.message_id,
              ].join('_'),
              options: [
                {
                  label: 'Option 1',
                  value: '1',
                },
                {
                  label: 'Option 2',
                  value: '2',
                },
              ],
            },
          ],
          defaultValue: {
            value: '1',
            label: 'Option 1',
          },
        }),
      ],
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
        this.messagessRepository.save({
          messageId: res.message_id,
          clanId: message.clan_id,
          channelId: res.channel_id,
          userId: message.sender_id,
          isPublic: message.is_public,
          mode: message.mode,
          jsonRawContent: JSON.stringify(msg),
          content: 'Select',
        });
      });

    return [];
  }
}
