import { BaseEntity } from 'src/common/base.entity';
import { BOT_TABLES } from 'src/common/enums/bot.enum';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MezonUser } from 'src/modules/mezon/domain/entities/mezon-user.entity';

@Entity(BOT_TABLES.REMIND)
export class Remind extends BaseEntity {
    /**
     * Cron run at timestamp utc
     */
    @Column({ type: 'bigint' })
    @IsDate()
    @IsNotEmpty()
    public remindAt: number;

    /**
     * Flag indicating whether the reminder has been sent
     * Default value is false
     */
    @Column({
        default: false
    })
    @IsBoolean()
    @IsNotEmpty()
    public isSent: boolean;

    /**
     * Content of the reminder message
     */
    @Column()
    @IsString()
    @IsNotEmpty()
    public content: string;

    /**
     * Flag indicating whether the reminder is active
     * Default value is true
     */
    @Column({
        default: true
    })
    @IsBoolean()
    @IsNotEmpty()
    public isActive: boolean;

    /**
     * ID of the user who created the reminder
     */
    @Column()
    @IsString()
    @IsNotEmpty()
    public remindBy: string;

    /**
     * User who created the reminder
     */
    @ManyToOne(() => MezonUser, (user) => user.reminds)
    @JoinColumn({ name: 'remindBy', referencedColumnName: 'id' })
    public mezonUser: MezonUser;

    /**
     * request mesage 
     */
    @Column()
    @IsString()
    @IsNotEmpty()
    public messageJson: string;
}
