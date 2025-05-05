import { ChannelMessage, EMarkdownType } from 'mezon-sdk';
import { Command } from '../../base/command-register.decorator';
import { BOT_COMMANDS } from 'src/common/enums/bot.enum';
import { addTagChannelInMessage, generateReplyMessage } from 'src/common/utils/message';
import { InjectRepository } from '@nestjs/typeorm';
import { VoiceChannel } from 'src/modules/mezon/domain/entities/voice-channel.entity';
import { In, Repository } from 'typeorm';
import { CommandBase } from '../../base/command.abstract';
import { Logger } from '@nestjs/common';
import { DEFAULT_CLAN_ID } from 'src/common/enums/mezon.enum';

@Command(BOT_COMMANDS.ADD_VOICE_CHANNELS)
export class AddVoiceChannelsCommand extends CommandBase {
    private readonly logger = new Logger(AddVoiceChannelsCommand.name);
    constructor(
        @InjectRepository(VoiceChannel)
        private readonly voiceChannelsRepository: Repository<VoiceChannel>,
    ) {
        super();
    }

    async execute(args: string[], message: ChannelMessage) {
        if (message.clan_id === DEFAULT_CLAN_ID) {
            return [
                generateReplyMessage({
                    messageContent: 'This command can only be used in a clan channel',
                    msg: message,
                }),
            ];
        }

        const argsVoiceChannelIds = message.content.hg?.map((s) => s.channelid);

        if (!argsVoiceChannelIds) {
            return [
                generateReplyMessage({
                    messageContent: 'No voice channels found',
                    msg: message,
                }),
            ];
        }

        const voiceChannels =
            await this.voiceChannelsRepository.find({
                where: { voiceChannelId: In(argsVoiceChannelIds) },
            });

        const existingVoiceChannelNames = voiceChannels.map(
            (vc) => vc.originalName,
        );

        const newVoiceChannels = argsVoiceChannelIds.filter(
            (voiceChannelId) =>
                !voiceChannels.some((vc) => vc.voiceChannelId === voiceChannelId),
        );

        if (!newVoiceChannels.length) {
            return [
                generateReplyMessage({
                    messageContent: 'All voice channels already exist',
                    msg: message,
                }),
            ];
        }

        const newVoiceChannelNames = args
            .filter((arg) => arg.startsWith('#'))
            .map((arg) => arg.replace('#', ''))
            .filter((arg) => !existingVoiceChannelNames.includes(arg));

        const _voiceChannels = await this.voiceChannelsRepository.save(
            newVoiceChannels.map((voiceChannelId) => ({
                voiceChannelId,
                originalName: newVoiceChannelNames.shift(),
                clanId: message.clan_id,
            }))
        );

        let messageContent = `Voice channels added: `;

        const hg = addTagChannelInMessage(
            messageContent,
            _voiceChannels.map((item) => ({
                id: item.voiceChannelId,
                name: item.originalName || item.voiceChannelId || item.voiceChannelId,
            })),
        );

        return [
            {
                ...generateReplyMessage({
                    messageContent,
                    msg: message,
                    type: EMarkdownType.SINGLE
                }),
                hg,
            }
        ];
    }
}
