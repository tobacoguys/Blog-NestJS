import { Controller, Post, UseGuards, Req, UnauthorizedException, Param, Get, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiKeyGuard } from 'src/auth/guard/api-key.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiTags('Wallet')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Create Wallet',
    description: 'Creator & User create wallet with JWT authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Create Wallet successfully.',
    type: CreateWalletDto,
  })
  @Post('create/:userId')
  @UseGuards(JwtAuthGuard)
  async createWallet(@Req() req) {
    const user = req.user;

    if (!user || !user.isCreator) {
      throw new UnauthorizedException('Access denied. Creator only.');
    }

    return this.walletService.createWallet(user.id);
  }

  @ApiTags('Wallet')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Get Wallet',
    description: 'Get wallet by creator ID with JWT authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Get Wallet successfully.',
    type: CreateWalletDto,
  })
  @Get(':creatorId')
  async getWallet(@Param('creatorId') creatorId: string) {
    return this.walletService.getWalletByCreatorId(creatorId);
  }

  @ApiTags('Wallet')
  @ApiBearerAuth('api-key')
  @ApiOperation({
    summary: 'Calculate Daily Earnings',
    description: 'Calculate daily earnings for all creators with API key authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily earnings calculated successfully.',
  })
  @Post('daily')
  @UseGuards(ApiKeyGuard)
  async calculateDailyEarnings() {
    return this.walletService.calculateDailyEarning();
  }

  @ApiTags('Wallet')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Request Withdrawal',
    description: 'Creator request withdrawal with API key authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal request successfully.',
  })
  @Post('/withdrawals')
  async createWithdrawal(@Body('creatorId') creatorId: string, @Body('amount') amount: number) {
    return this.walletService.requestWithdrawal(creatorId, amount);
  }
}
