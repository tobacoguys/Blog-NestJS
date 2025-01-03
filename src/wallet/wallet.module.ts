import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity'
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Post } from 'src/post/post.entity';
import { DailyEarning } from './entity/daily-earning.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Wallet, Post, DailyEarning])],
    controllers: [WalletController], 
    providers: [WalletService],
})
export class WalletModule {}
