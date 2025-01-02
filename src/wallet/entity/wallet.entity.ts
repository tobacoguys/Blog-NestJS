import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('wallet') 
export class Wallet {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    creatorId: string;

    @Column({ default: 0 })
    balance: number;
}