import { Module } from '@nestjs/common';
import { MezonModule } from '../mezon/mezon.module';
import { BotGateway } from './bot.gateway';
import { EventListenerChannelMessage } from './listeners/channel-message.lissten';
import { Asterisk } from './asterisk-commands/asterisk';
import { HelpCommand } from './asterisk-commands/commands';
@Module({
  imports: [MezonModule],
  providers: [BotGateway, EventListenerChannelMessage, Asterisk, HelpCommand],
  exports: [BotGateway],
})
export class BotModule {}
