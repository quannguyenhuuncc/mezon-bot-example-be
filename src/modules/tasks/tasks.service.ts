import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Remind } from './domain/entities/remind.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CronJob } from 'cron';
import { MezonService } from '../mezon/mezon.service';
import { generateChannelMessageContent, generateMessageRef } from 'src/common/utils/message';
import { ChannelMessage } from 'mezon-sdk';
import { getLast15MinutesTimestamp } from 'src/common/utils/helper';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Remind)
        private readonly remindRepository: Repository<Remind>,
        private readonly mezonService: MezonService,
        private schedulerRegistry: SchedulerRegistry
    ) { }

    onModuleInit() {
        const job = new CronJob('0 */1 * * * *', () => {
            this.logger.log('Running dynamic cron job every 1 minute');
            this.remind();
        });

        this.schedulerRegistry.addCronJob('dynamicJob', job);
        job.start();
    }

    async remind() {
        const [fifteenMinutesAgoTimestamp, nowTimestamp] = getLast15MinutesTimestamp();
        const reminds = await this.remindRepository.find({
            where: {
                isActive: true,
                isSent: false,
                remindAt: Between(fifteenMinutesAgoTimestamp, nowTimestamp),
            },
            relations: ['mezonUser'],
        })

        this.logger.log(reminds);

        for (const remind of reminds) {
            const messageOriginal = JSON.parse(remind.messageJson) as ChannelMessage;
            this.mezonService.sendMessage({
                clan_id: messageOriginal.clan_id!,
                channel_id: messageOriginal.channel_id!,
                is_public: messageOriginal.is_public!,
                mode: messageOriginal.mode!,
                msg: generateChannelMessageContent({
                    message: remind.content,
                    blockMessage: true,
                }),
                ref: generateMessageRef(messageOriginal),
            }).then(() => {
                remind.isSent = true;
                this.remindRepository.save(remind);
            })
        }
    }

    addCronJob(name: string, cronTime: string) {
        const job = new CronJob(cronTime, () => {
            this.logger.log(`Executing job: ${name}`);
        });

        this.schedulerRegistry.addCronJob(name, job);
        job.start();

        this.logger.log(`Added cron job: ${name}`);
    }

    deleteCronJob(name: string) {
        try {
            this.schedulerRegistry.deleteCronJob(name);
            this.logger.warn(`Deleted cron job: ${name}`);
        } catch (err) {
            this.logger.error(`Failed to delete cron job "${name}": ${err.message}`);
        }
    }

    listCronJobs(): string[] {
        return Array.from(this.schedulerRegistry.getCronJobs().keys());
    }
}