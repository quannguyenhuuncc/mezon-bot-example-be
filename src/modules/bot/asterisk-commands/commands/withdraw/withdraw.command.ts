import { ChannelMessage } from 'mezon-sdk';
import { BOT_COMMANDS, BOT_CONFIG } from 'src/common/enums/bot.enum';
import { CommandBase } from '../../base/command.abstract';
import { Command } from '../../base/command-register.decorator';
import { generateReplyMessage } from 'src/common/utils/message';
import { Logger } from '@nestjs/common';
import { MezonService } from 'src/modules/mezon/mezon.service';
import { ConfigService } from 'src/modules/config/config.service';

@Command(BOT_COMMANDS.WITHDRAW)
@Command(BOT_COMMANDS.WD)
export class WDCommand extends CommandBase {
  private readonly logger = new Logger(WDCommand.name);
  constructor(private clientService: MezonService, private readonly configService: ConfigService) {
    super();
  }

  async execute(agrs: string[], message: ChannelMessage) {
    const amount = parseInt(agrs[0]);
    const botName = this.configService.get(
      BOT_CONFIG.BOT_NAME,
      BOT_CONFIG.BOT_NAME,
    );
    const botId = this.configService.get(
      BOT_CONFIG.BOT_ID,
      BOT_CONFIG.BOT_ID,
    ) as string;

    this.clientService.sendToken({
      amount,
      receiver_id: message.sender_id,
      sender_name: botName,
      note: 'Withdraw',
      sender_id: botId,
    }).then((res: any) => {
      this.logger.log(`res: ${JSON.stringify(res, null, 2)}`);
    }).catch((err) => {
      this.logger.error(`err: ${JSON.stringify(err, null, 2)} `);
    });
    return [];
  }
}
