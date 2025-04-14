import { Module } from '@nestjs/common';
import { MezonModule } from '../mezon/mezon.module';
import { BotGateway } from './bot.gateway';
import { EventListenerChannelMessage } from './listeners/channel-message.lissten';
import { Asterisk } from './asterisk-commands/asterisk';
import { HelpCommand } from './asterisk-commands/commands';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../mezon/domain/entities/channel.entity';
import { MezonUser } from '../mezon/domain/entities/mezon-users.entity';

@Module({
  imports: [MezonModule, TypeOrmModule.forFeature([Channel, MezonUser])],
  providers: [BotGateway, EventListenerChannelMessage, Asterisk, HelpCommand],
  exports: [BotGateway],
})
export class BotModule {}
