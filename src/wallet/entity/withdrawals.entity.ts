import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  creatorId: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'varchar', length: 50 })
  status: 'PENDING' | 'COMPLETED' | 'FAILED';

  @CreateDateColumn()
  createdAt: Date;
}
