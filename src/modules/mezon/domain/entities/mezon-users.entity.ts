import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../../../common/base.entity';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
@Entity('mezon_users')
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
    name: 'display_name',
  })
  @IsString()
  @IsOptional()
  display_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  @IsEmail()
  @IsOptional()
  email: string;
}
