import { Module } from '@nestjs/common';
import { MezonModule } from '../mezon/mezon.module';
import { BotGateway } from './bot.gateway';
import { EventListenerChannelMessage } from './listeners/channelMessage.lissten';
@Module({
  imports: [MezonModule],
  providers: [BotGateway, EventListenerChannelMessage],
  exports: [BotGateway],
})
export class BotModule {}
