import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';
import { Post } from 'src/post/post.entity';
import { DailyEarning } from './entity/daily-earning.entity';
import { Withdrawal } from './entity/withdrawals.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(DailyEarning)
    private dailyEarningRepository: Repository<DailyEarning>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
  ) {}

  async createWallet(creatorId: string) {
    const existingWallet = await this.walletRepository.findOne({ where: { creatorId } });
    if (existingWallet) {
      throw new BadRequestException('Wallet already exists for this creator.');
    }

    const newWallet = this.walletRepository.create({ creatorId, balance: 0 });
    return this.walletRepository.save(newWallet);
  }

  async getWalletByCreatorId(creatorId: string) {
    const wallet = await this.walletRepository.findOne({ where: { creatorId } });
    if (!wallet) {
      throw new BadRequestException (`Wallet not found for creatorId: ${creatorId}`);
    }
    return wallet;
  }

  async requestWithdrawal(creatorId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Invalid withdrawal amount');
    }

    const wallet = await this.walletRepository.findOne({ where: { creatorId } });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (amount > wallet.balance) {
      throw new BadRequestException('Insufficient balance');
    }

    const withdrawal = this.withdrawalRepository.create({
      creatorId,
      amount,
      status: 'PENDING',
      createdAt: new Date(),
    });

    wallet.balance -= amount;

    await this.walletRepository.save(wallet);
    await this.withdrawalRepository.save(withdrawal);

    return withdrawal;
  }
}
