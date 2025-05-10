import { BaseEntity } from 'src/common/base.entity';
import { BOT_TABLES } from 'src/common/enums/bot.enum';
import { Entity, Column } from 'typeorm';
@Entity(BOT_TABLES.VOICE_CHANNEL)
export class VoiceChannel extends BaseEntity {
    @Column({ nullable: false, unique: true })
    voiceChannelId: string;

    @Column({ nullable: false })
    originalName: string;

    @Column({
        default: 0,
        comment: 'Flag indicating if the channel is private (1) or public (0)'
    })
    private: number;

    @Column({ nullable: true })
    clanId: string;

    /**
     * Check if the voice channel is private
     */
    isPrivate(): boolean {
        return this.private === 1;
    }

    /**
     * Set the voice channel privacy status
     */
    setPrivacy(isPrivate: boolean): void {
        this.private = isPrivate ? 1 : 0;
    }
}
