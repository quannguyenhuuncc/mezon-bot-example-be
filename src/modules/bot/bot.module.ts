import { Module } from '@nestjs/common';
import { MezonModule } from '../mezon/mezon.module';
import { BotGateway } from './bot.gateway';
import { EventListenerChannelMessage } from './listeners/on-mezon-listener/channel-message.listen';
import { Asterisk } from './asterisk-commands/asterisk';
import { HelpCommand } from './asterisk-commands/commands';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../mezon/domain/entities/mezon-channel.entity';
import { MezonUser } from '../mezon/domain/entities/mezon-user.entity';
import { MessageButtonClickListener } from './listeners/on-mezon-listener/message-button-click.listen';
import { PingCommand } from './asterisk-commands/commands/ping/ping.command';
import { MezonBotMessage } from '../mezon/domain/entities/mezon-bot-message.entity';
import { UpdateMessageCommand } from './asterisk-commands/commands/update_message/update-massage.command';
import { UpdateMessageExcuteListener } from './listeners/handler/button-click/update-message-excute.listen';
import { SelectMessageComponentCommand } from './asterisk-commands/commands/select_message_component/select_message_component.command';
import { SelectMessageExcuteListener } from './listeners/handler/button-click/select-message-execute.listen';
import { EmbedCommand } from './asterisk-commands/commands/embed_message/embed_message.command';
import { EmbedMessageExcuteListener } from './listeners/handler/button-click/embed-excute.listen';
import { SendTokenListener } from './listeners/on-mezon-listener/send-token.listen';
import { WDCommand } from './asterisk-commands/commands/withdraw/withdraw.command';

@Module({
  imports: [
    MezonModule,
    TypeOrmModule.forFeature([Channel, MezonUser, MezonBotMessage]),
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
    WDCommand
  ],
  exports: [BotGateway],
})
export class BotModule { }
