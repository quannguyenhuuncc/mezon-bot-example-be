import { ChannelMessage, EMarkdownType } from 'mezon-sdk';
import { BOT_COMMANDS } from 'src/common/enums/bot.enum';
import { CommandBase } from '../../base/command.abstract';
import { Command } from '../../base/command-register.decorator';
import { CommandStorage } from '../../base/storage';
import { generateReplyMessage, refGenerate } from 'src/common/utils/message';

@Command(BOT_COMMANDS.HELP)
export class HelpCommand extends CommandBase {
  constructor() {
    super();
  }

  async execute(_: string[], message: ChannelMessage) {
    const allCommands = CommandStorage.getVisibleCommandNames();
    const messageContent = [
      'BOT_COMMANDS - Help Menu',
      `• BOT_COMMANDS (${allCommands.length})`,
      allCommands.join(', '),
    ].join('\n');
    return [generateReplyMessage({ messageContent, msg: message })];
  }
}
