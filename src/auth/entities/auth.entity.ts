import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('login')
export class Login {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Column({ length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ length: 100 })
  username!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 50, default: 'user' })
  role!: string;

  @Column({ name: 'auth_token', length: 255, nullable: true })
  authToken!: string;

  @Column({ default: true })
  status!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt!: Date;
}
