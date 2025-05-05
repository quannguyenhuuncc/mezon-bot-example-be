import { Module } from '@nestjs/common';
import { MezonModule } from '../mezon/mezon.module';
import { BotGateway } from './bot.gateway';
import { EventListenerChannelMessage } from './listeners/on-mezon-listener/channel-message.listen';
import { Asterisk } from './asterisk-commands/asterisk';
import { AddVoiceChannelsCommand, HelpCommand, EmbedCommand, PingCommand, SelectMessageComponentCommand, UpdateMessageCommand, WDCommand, MentionCommand } from './asterisk-commands/commands';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../mezon/domain/entities/mezon-channel.entity';
import { MezonUser } from '../mezon/domain/entities/mezon-user.entity';
import { MessageButtonClickListener } from './listeners/on-mezon-listener/message-button-click.listen';
import { MezonBotMessage } from '../mezon/domain/entities/mezon-bot-message.entity';
import { UpdateMessageExcuteListener } from './listeners/handler/button-click/update-message-excute.listen';
import { SelectMessageExcuteListener } from './listeners/handler/button-click/select-message-execute.listen';
import { EmbedMessageExcuteListener } from './listeners/handler/button-click/embed-excute.listen';
import { SendTokenListener } from './listeners/on-mezon-listener/send-token.listen';
import { VoiceChannel } from '../mezon/domain/entities/voice-channel.entity';

@Module({
  imports: [
    MezonModule,
    TypeOrmModule.forFeature([Channel, MezonUser, MezonBotMessage, VoiceChannel]),
  ],
  providers: [
    BotGateway,
    // Listeners
    EventListenerChannelMessage,
    MessageButtonClickListener,
    UpdateMessageExcuteListener,
    SelectMessageExcuteListener,
    EmbedMessageExcuteListener,
    SendTokenListener,

    Asterisk,
    // Commands
    HelpCommand,
    PingCommand,
    UpdateMessageCommand,
    SelectMessageComponentCommand,
    EmbedCommand,
    WDCommand,
    AddVoiceChannelsCommand,
    MentionCommand
  ],
  exports: [BotGateway],
})
export class BotModule { }
