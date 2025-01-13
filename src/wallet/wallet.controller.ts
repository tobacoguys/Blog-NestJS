import { Controller, Post, UseGuards, Req, UnauthorizedException, Get, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
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
  @Post('create')
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
  @UseGuards(JwtAuthGuard)
  @Get()
  async getWallet(@Req() req) {
    const user = req.user;

    if (!user || !user.isCreator) {
      throw new UnauthorizedException('Access denied. Creator only.');
    }

    return this.walletService.getWalletByCreatorId(user.id);
  }

  @ApiTags('Wallet')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Request Withdrawal',
    description: 'Creator request withdrawal with JWT authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal request successfully.',
  })
  @Post('/withdrawals')
  @UseGuards(JwtAuthGuard)
  async createWithdrawal(@Req() req, @Body('amount') amount: number) {
    const user = req.user;

    if (!user || !user.isCreator) {
      throw new UnauthorizedException('Access denied. Creator only.');
    }

    return this.walletService.requestWithdrawal(user.id, amount);
  }
}
