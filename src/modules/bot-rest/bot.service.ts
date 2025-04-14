import { Injectable, Logger } from '@nestjs/common';
import { MezonService } from '../mezon/mezon.service';
import { Repository } from 'typeorm';
import { MezonUser } from '../mezon/domain/entities/mezon-users.entity';
import { Channel } from '../mezon/domain/entities/channel.entity';
import { generateChannelMessageContent } from 'src/common/utils/message';
import { EMarkdownType } from 'mezon-sdk';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    private readonly mezonService: MezonService,
    @InjectRepository(MezonUser)
    private readonly usersRepository: Repository<MezonUser>,
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
  ) {}

  sendMessage({
    channelId,
    message,
    markdownType,
  }: {
    message: string;
    channelId: string;
    markdownType?: EMarkdownType;
  }) {
    this.channelsRepository
      .findOne({
        where: { channelId },
      })
      .then(channel => {
        if (!channel) {
          this.logger.error(`Channel ${channelId} not found`);
          return;
        }

        this.mezonService.sendMessage({
          clan_id: channel.clanId,
          channel_id: channel.channelId,
          is_public: channel.isPublic,
          mode: channel.type,
          msg: generateChannelMessageContent({
            message,
            blockMessage: markdownType === EMarkdownType.TRIPLE,
          }),
          ref: [],
        });
      });
  }
}
