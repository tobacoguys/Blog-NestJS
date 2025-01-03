import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';
import { Post } from 'src/post/post.entity';
import { DailyEarning } from './entity/daily-earning.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(DailyEarning)
    private dailyEarningRepository: Repository<DailyEarning>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async calculateDailyEarning() {
    const posts = await this.postRepository.find({ relations: ['user'] });
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Collect processed data for response
    const result: Array<{
      creatorId: string;
      viewsToday: number;
      earningToday: number;
      totalBalance: number;
      postId: string;
    }> = [];

    for (const post of posts) {
      if (!post.user) {
        console.warn(`Post with ID ${post.id} has no associated user.`);
        continue;
      }

      const earning = post.viewCount * 2;
      let dailyEarning = await this.dailyEarningRepository.findOne({
        where: { creatorId: post.user.id, date: todayString as unknown as Date },
      });

      if (dailyEarning) {
        dailyEarning.viewsToday += post.viewCount;
        dailyEarning.earningToday += earning;
      } else {
        dailyEarning = this.dailyEarningRepository.create({
          creatorId: post.user.id,
          date: today,
          viewsToday: post.viewCount,
          earningToday: earning,
          postId: post.id,
        });
      }
      await this.dailyEarningRepository.save(dailyEarning);

      const wallet = await this.walletRepository.findOne({
        where: { creatorId: post.user.id },
      });

      if (wallet) {
        wallet.balance += earning;
        await this.walletRepository.save(wallet);

        result.push({
          creatorId: post.user.id,
          viewsToday: dailyEarning.viewsToday,
          earningToday: dailyEarning.earningToday,
          totalBalance: wallet.balance,
          postId: post.id
        });
      } else {
        console.warn(`Wallet not found for creator ID ${post.user.id}`);
      }

      // Reset view count for the post
      post.viewCount = 0;
      await this.postRepository.save(post);
    }

    return {
      message: 'Daily earnings calculated successfully.',
      result,
    };
  }
}
