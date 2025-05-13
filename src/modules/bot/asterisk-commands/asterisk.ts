import { ChannelMessage } from 'mezon-sdk';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandStorage } from './base/storage';
import { CommandBase } from './base/command.abstract';
import { ConfigService } from 'src/modules/config/config.service';
import { BOT_CONFIG } from 'src/common/enums/bot.enum';

@Injectable()
export class Asterisk implements AsteriskInterface {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly configService: ConfigService,
  ) { }

  async execute(
    messageContent: string,
    message: ChannelMessage,
  ): Promise<Array<MessageForChannel | MessageForUser>> {
    const { commandName, args } = this.extractMessage(messageContent);
    const target = CommandStorage.getCommand(commandName);
    if (target) {
      const command: CommandBase = this.moduleRef.get(target.commandClass);
      if (command) {
        return command
          .execute(args, message)
          .then(result => {
            return result;
          })
          .catch(error => {
            throw error;
          });
      }
    }
    return Promise.resolve([]);
  }

  extractMessage = (messageContent: string) => {
    const trimmedMessageContent = messageContent.trim();
    const botCommandPrefixs = [this.configService.get(
      BOT_CONFIG.COMMAND_PREFIX,
      '*',
    )];
    if (
      !botCommandPrefixs.some(prefix =>
        trimmedMessageContent.startsWith(prefix),
      )
    ) {
      return { commandName: '', args: [] };
    }
    const [commandName, ...args] = botCommandPrefixs
      .reduce((acc, prefix) => {
        return acc.replace(prefix, '').trim();
      }, trimmedMessageContent)
      .split(' ');
    return { commandName, args };
  };
}
