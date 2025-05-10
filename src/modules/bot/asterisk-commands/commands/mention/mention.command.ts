import { ChannelMessage, EMarkdownType } from 'mezon-sdk';
import { Command } from '../../base/command-register.decorator';
import { BOT_COMMANDS } from 'src/common/enums/bot.enum';
import {
    addMentionsInMessage,
    generateReplyMessage,
} from 'src/common/utils/message';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CommandBase } from '../../base/command.abstract';
import { Logger } from '@nestjs/common';

import { MezonUser } from 'src/modules/mezon/domain/entities/mezon-user.entity';

@Command(BOT_COMMANDS.MENTION)
export class MentionCommand extends CommandBase {
    private readonly logger = new Logger(MentionCommand.name);
    constructor(
        @InjectRepository(MezonUser)
        private readonly mezonUsersRepository: Repository<MezonUser>,
    ) {
        super();
    }

    async execute(_: string[], message: ChannelMessage) {
        const usersArgIds = message.mentions?.map(mention => mention.user_id);
        if (!usersArgIds) {
            return [
                generateReplyMessage({
                    messageContent: 'No users found',
                    msg: message,
                }),
            ];
        }

        const users = await this.mezonUsersRepository.find({
            where: {
                userId: In(usersArgIds),
            },
        });

        if (!users.length) {
            return [
                generateReplyMessage({
                    messageContent: 'No users found in database',
                    msg: message,
                }),
            ];
        }
        const messageContent = 'users found:  ';
        const joinStr = ' -  ';

        return [
            {
                ...generateReplyMessage({
                    messageContent: messageContent + users
                        .map((user) => `@${user.username || user.userId}`)
                        .join(joinStr),
                    msg: message,
                    type: EMarkdownType.SINGLE,
                }),
                mentions: addMentionsInMessage(
                    users.map(user => ({
                        id: user.userId,
                        username: user.displayName || user.username || user.userId,
                    })),
                    messageContent,
                    joinStr
                ),
            },
        ];
    }
}
