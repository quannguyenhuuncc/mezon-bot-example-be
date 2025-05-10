import { Column, Entity, Index, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../../../common/base.entity';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BOT_TABLES } from 'src/common/enums/bot.enum';
import { Remind } from 'src/modules/tasks/domain/entities/remind.entity';
@Entity(BOT_TABLES.MEZON_USER)
@Index(['userId', 'email'])
export class MezonUser extends BaseEntity {
  @PrimaryColumn()
  @Exclude()
  @Index()
  @IsNotEmpty()
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsString()
  @IsOptional()
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'displayName',
  })
  @IsString()
  @IsOptional()
  displayName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @OneToMany(() => Remind, (remind) => remind.mezonUser)
  @JoinColumn({ name: 'remind_by' })
  public reminds: Remind[];
}
