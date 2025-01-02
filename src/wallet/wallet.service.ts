import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
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
    const wallet = await this.walletRepository.findOne({ where: { creatorId }, });
    if (!wallet) {
      throw new Error(`Wallet not found for creatorId: ${creatorId}`);
    }
    return wallet;
  }
}
