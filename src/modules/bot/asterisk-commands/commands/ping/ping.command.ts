import { ChannelMessage } from 'mezon-sdk';
import { BOT_COMMANDS } from 'src/common/enums/bot.enum';
import { CommandBase } from '../../base/command.abstract';
import { Command } from '../../base/command-register.decorator';
import { generateReplyMessage } from 'src/common/utils/message';

@Command(BOT_COMMANDS.PING)
export class PingCommand extends CommandBase {
  constructor() {
    super();
  }

  async execute(_: string[], message: ChannelMessage) {
    return [
      generateReplyMessage({
        messageContent: 'Bot is ready',
        msg: message,
      }),
    ];
  }
}
