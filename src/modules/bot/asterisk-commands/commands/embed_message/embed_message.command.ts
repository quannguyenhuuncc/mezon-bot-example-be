import { ChannelMessage, EButtonMessageStyle, EMessageComponentType } from 'mezon-sdk';
import { BOT_BUTTON_ACTION_FEATURES, BOT_COMMANDS } from 'src/common/enums/bot.enum';
import { CommandBase } from '../../base/command.abstract';
import { Command } from '../../base/command-register.decorator';
import { generateChannelMessageContent, generateEmbedMessage, generateInputEmbedMessage, generateSelectEmbedMessage, generateMessageRef, generateRadioEmbedMessage, generateButtonMessageComponents } from 'src/common/utils/message';
import { Logger } from '@nestjs/common';
import { MezonService } from 'src/modules/mezon/mezon.service';
import { MezonBotMessage } from 'src/modules/mezon/domain/entities/mezon-bot-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRandomColor } from 'src/common/utils/helper';
import { BotButtonIdPrefix } from 'src/common/constants';

@Command(BOT_COMMANDS.EMBED)
export class EmbedCommand extends CommandBase {
  private readonly logger = new Logger(EmbedCommand.name);
  constructor(
    private clientService: MezonService,
    @InjectRepository(MezonBotMessage)
    private readonly messagessRepository: Repository<MezonBotMessage>,
  ) {
    super();
  }

  async execute(_: string[], message: ChannelMessage) {
    const msg = {
      // ...generateChannelMessageContent({
      //   message: BOT_COMMANDS.INPUT_EMBED,
      //   blockMessage: true,
      // }),
      embed: generateEmbedMessage({
        title: 'EMBED TITLE',
        color: getRandomColor(),
        timestamp: (new Date()).toISOString(),
        fields: [generateInputEmbedMessage({
          label: "INPUT EMBED LABEL",
          value: 'INPUT EMBED VALUE',
          id: 'INPUT EMBED ID',
          placeholder: 'INPUT EMBED PLACEHOLDER',
          required: true,
          textarea: false,
          defaultValue: 'INPUT EMBED DEFAULT VALUE'
        }), generateSelectEmbedMessage({
          label: "SELECT EMBED LABEL",
          value: 'SELECT EMBED VALUE',
          id: 'SELECT EMBED ID',
          options: [{
            label: "SELECT EMBED OPTION LABEL",
            value: 'SELECT EMBED OPTION VALUE',
          }, {
            label: "SELECT EMBED OPTION LABEL1",
            value: 'SELECT EMBED OPTION VALUE1',
          }],
          required: true,
          valueSelected: {
            label: "SELECT EMBED OPTION LABEL",
            value: 'SELECT EMBED OPTION VALUE',
          }
        }), generateRadioEmbedMessage({
          name: 'RADIO EMBED NAME',
          id: 'RADIO EMBED ID',
          options: [{
            label: "RADIO EMBED OPTION LABEL",
            value: 'RADIO EMBED OPTION VALUE',
            description: 'RADIO EMBED OPTION DESCRIPTION',
            style: EButtonMessageStyle.DANGER,
          }, {
            label: "RADIO EMBED OPTION LABEL 2",
            value: 'RADIO EMBED OPTION VALUE 2',
            description: 'RADIO EMBED OPTION DESCRIPTION 2',
            style: EButtonMessageStyle.SECONDARY,
          }, {
            label: "RADIO EMBED OPTION LABEL 3",
            value: 'RADIO EMBED OPTION VALUE 3',
            description: 'RADIO EMBED OPTION DESCRIPTION 3',
            style: EButtonMessageStyle.SUCCESS,
          }],
        })],
      }),
      components: generateButtonMessageComponents({
        buttonGroups: [
          {
            buttons: [
              {
                id: [
                  BotButtonIdPrefix,
                  BOT_BUTTON_ACTION_FEATURES.EMBED_EXECUTE,
                ].join('_'),
                label: 'Submit',
                style: EButtonMessageStyle.PRIMARY,
              },
            ],
          },
        ],
      }),
    };
    this.logger.log('Message sent' + JSON.stringify(msg, null, 2));
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
        this.logger.log('Message sent' + JSON.stringify(res, null, 2));
        this.messagessRepository.insert({
          messageId: res.message_id,
          clanId: message.clan_id,
          channelId: res.channel_id,
          userId: message.sender_id,
          isPublic: message.is_public,
          mode: message.mode,
          rawContent: JSON.stringify(msg),
          content: BOT_COMMANDS.EMBED,
        });
      }).catch(res => {
        this.logger.error('Message not sent' + JSON.stringify(res, null, 2));
      });

    return [];
  }
}
