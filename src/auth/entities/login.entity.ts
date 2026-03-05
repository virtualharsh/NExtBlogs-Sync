import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column('varchar', { length: 50, unique: true })
  email!: string;

  @Column('varchar', { length: 25, nullable: false })
  username!: string;

  @Column('varchar', { length: 25, nullable: false })
  password!: string;

  @Column()
  refresh_token!: string;

  @Column('boolean', { default: true })
  status!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  modified_at!: Date;
}
