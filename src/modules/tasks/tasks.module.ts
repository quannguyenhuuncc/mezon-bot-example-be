import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remind } from './domain/entities/remind.entity';
import { MezonUser } from '../mezon/domain/entities/mezon-user.entity';
import { MezonModule } from '../mezon/mezon.module';

@Module({
  imports: [TypeOrmModule.forFeature([MezonUser, Remind]), MezonModule],
  providers: [TasksService]
})
export class TasksModule { }
