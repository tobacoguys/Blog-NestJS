import { Controller, Post, UseGuards, Req, UnauthorizedException, Param, Get, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiKeyGuard } from 'src/auth/guard/api-key.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create/:userId')
  @UseGuards(JwtAuthGuard)
  async createWallet(@Req() req) {
    const user = req.user;

    if (!user || !user.isCreator) {
      throw new UnauthorizedException('Access denied. Creator only.');
    }

    return this.walletService.createWallet(user.id);
  }

  @Get(':creatorId')
  async getWallet(@Param('creatorId') creatorId: string) {
    return this.walletService.getWalletByCreatorId(creatorId);
  }

  @Post('daily')
  @UseGuards(ApiKeyGuard)
  async calculateDailyEarnings() {
    return this.walletService.calculateDailyEarning();
  }

  @Post('/withdrawals')
  async createWithdrawal(@Body('creatorId') creatorId: string, @Body('amount') amount: number) {
    return this.walletService.requestWithdrawal(creatorId, amount);
  }
}
