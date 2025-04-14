import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MezonUser } from '../mezon/domain/entities/mezon-users.entity';
import { Channel } from '../mezon/domain/entities/channel.entity';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
@Module({
  imports: [TypeOrmModule.forFeature([MezonUser, Channel])],
  providers: [BotService],
  controllers: [BotController],
  exports: [BotService],
})
export class BotModule {}
