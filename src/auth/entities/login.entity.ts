import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Login {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  user_id!: number;

  @ApiProperty({ example: 'test@gmail.com' })
  @Column('varchar', { length: 50, unique: true })
  email!: string;

  @ApiProperty({ example: 'harsh_sonegra' })
  @Column('varchar', { length: 25, nullable: true, default: '' })
  username!: string;

  @ApiProperty({ example: 'hashedpassword' })
  @Column('varchar', { length: 255 })
  password!: string;

  @ApiProperty({ example: true })
  @Column('boolean', { default: true })
  status!: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  modified_at!: Date;
}
