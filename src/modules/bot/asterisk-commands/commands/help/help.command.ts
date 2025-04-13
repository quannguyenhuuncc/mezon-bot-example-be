import { ChannelMessage } from 'mezon-sdk';
import { BOT_COMMANDS, BOT_CONFIG } from 'src/common/enums/bot.enum';
import { CommandBase } from '../../base/command.abstract';
import { Command } from '../../base/command-register.decorator';
import { CommandStorage } from '../../base/storage';
import { generateReplyMessage } from 'src/common/utils/message';
import { ConfigService } from 'src/modules/config/config.service';
import { showIf } from 'src/common/utils/helper';

const replyTemplate = ({
  botName,
  botCommandsCount,
  commandNames,
  dynamicCommands,
  dynamicCommandsCount,
}: {
  botName: string;
  botCommandsCount: number;
  commandNames: string[];
  dynamicCommands: string[];
  dynamicCommandsCount: number;
}) => `${botName} - Help Menu
• BOT_COMMANDS (${botCommandsCount})
  - ${commandNames.join(', ')}
${showIf(
  dynamicCommandsCount > 0,
  `• DYNAMIC_COMMANDS (${dynamicCommandsCount})
  - ${dynamicCommands.join(', ')}`,
)}`;

@Command(BOT_COMMANDS.HELP)
export class HelpCommand extends CommandBase {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async execute(_: string[], message: ChannelMessage) {
    const allCommands = CommandStorage.getVisibleCommandNames();
    const botName = this.configService.get(
      BOT_CONFIG.BOT_NAME,
      BOT_CONFIG.BOT_NAME,
    );
    const messageContent = replyTemplate({
      botName,
      botCommandsCount: allCommands.length,
      commandNames: allCommands,
      dynamicCommands: [],
      dynamicCommandsCount: 0,
    });
    return [generateReplyMessage({ messageContent, msg: message })];
  }
}
