import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base.entity';
import { Exclude } from 'class-transformer';
import { BOT_TABLES } from 'src/common/enums/bot.enum';

@Entity(BOT_TABLES.USER)
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;
}
