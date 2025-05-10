import { ChannelMessage } from 'mezon-sdk';
import { BOT_COMMANDS } from 'src/common/enums/bot.enum';
import { CommandBase } from '../../base/command.abstract';
import { Command } from '../../base/command-register.decorator';
import { generateReplyMessage } from 'src/common/utils/message';
import { InjectRepository } from '@nestjs/typeorm';
import { Remind } from 'src/modules/tasks/domain/entities/remind.entity';
import { Repository } from 'typeorm';
import { MezonUser } from 'src/modules/mezon/domain/entities/mezon-user.entity';
import { Logger } from '@nestjs/common';
import { toUtcTimestamp } from 'src/common/utils/helper';

@Command(BOT_COMMANDS.REMIND)
export class RemindCommand extends CommandBase {
  private readonly logger = new Logger(RemindCommand.name);
  constructor(
    @InjectRepository(Remind)
    private readonly remindRepository: Repository<Remind>,
    @InjectRepository(MezonUser)
    private readonly mezonUserRepository: Repository<MezonUser>,
  ) {
    super();
  }

  async execute(args: string[], message: ChannelMessage) {
    this.logger.log(`Remind command: ${args}`);

    // Nếu thiếu args thì trả về remind help
    // cấu trúc *remind + <cron time> + <message>
    // *remind 2025-01-01 00:00:00 +0700 Hello world
    if (args.length < 4) {
      return [
        generateReplyMessage({
          messageContent: `📅 Remind Command Help
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage: *remind Date Time Timezone <message>

Date: YYYY-MM-DD
Time: HH:MM:SS
Timezone: +HHMM / -HHMM

Example: *remind 2025-01-01 00:00:00 +0700 Hello world -> Remind you at 2025-01-01 00:00:00 +0700
`,
          msg: message,
        }),
      ];
    }

    // Validate date, time and timezone formats
    const dateTimeValidation = {
      date: {
        regex: /^\d{4}-\d{2}-\d{2}$/,
        message: 'Date format is invalid. Expected format: YYYY-MM-DD',
        value: args[0]
      },
      time: {
        regex: /^\d{2}:\d{2}:\d{2}$/,
        message: 'Time format is invalid. Expected format: HH:MM:SS',
        value: args[1]
      },
      timezone: {
        regex: /^[+-]\d{4}$/,
        message: 'Timezone format is invalid. Expected format: +HHMM or -HHMM',
        value: args[2]
      }
    };

    for (const [_, validation] of Object.entries(dateTimeValidation)) {
      if (!validation.regex.test(validation.value)) {
        return [
          generateReplyMessage({
            messageContent: validation.message,
            msg: message,
          }),
        ];
      }
    }

    const [dateString, timeString, timeZone, ...content] = args;

    // Convert input date/time to UTC timestamp
    const utcTimestamp = toUtcTimestamp(dateString, timeString, timeZone);

    const now = new Date();
    const currentUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
  );
    if (utcTimestamp < currentUtc) {
      return [
        generateReplyMessage({
          messageContent: 'Cannot set reminder for a past date. Please specify a future date and time.',
          msg: message,
        }),
      ];
    }

    const user = await this.mezonUserRepository.findOne({
      where: {
        userId: message.sender_id
      },
    });

    if (!user) {
      return [
        generateReplyMessage({
          messageContent: 'Not found user',
          msg: message,
        }),
      ];
    }

    const remind = new Remind();
    remind.remindBy = user.id;
    remind.remindAt = utcTimestamp;
    remind.content = content.join(' ');
    remind.messageJson = JSON.stringify(message);

    await this.remindRepository.save(remind);

    return [
      generateReplyMessage({
        messageContent: 'Remind created',
        msg: message,
      }),
    ];
  }

}
