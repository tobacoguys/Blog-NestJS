import { Controller, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

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
}
