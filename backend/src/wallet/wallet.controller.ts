import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // ─── Balance ───────────────────────────────────────────────────────────────

  @Get('balance')
  getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.sub);
  }

  // ─── Deposit ────────────────────────────────────────────────────────────────

  @Post('deposit')
  deposit(@Request() req, @Body() body: { amount: number; walletType?: string }) {
    return this.walletService.deposit(req.user.sub, body.amount, body.walletType);
  }

  // ─── Withdraw ───────────────────────────────────────────────────────────────

  @Post('withdraw')
  withdraw(@Request() req, @Body() body: { amount: number; walletType?: string }) {
    return this.walletService.withdraw(req.user.sub, body.amount, body.walletType);
  }

  // ─── Transfer ───────────────────────────────────────────────────────────────

  @Post('transfer')
  transfer(@Request() req, @Body() body: { amount: number; targetWallet: string }) {
    return this.walletService.transfer(req.user.sub, body.amount, body.targetWallet);
  }

  // ─── Transactions ───────────────────────────────────────────────────────────

  @Get('transactions')
  getTransactions(@Request() req, @Query('type') type?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    const skip = (Number(page || 1) - 1) * Number(limit || 20);
    return this.walletService.getTransactions(req.user.sub, type, skip, Number(limit || 20));
  }

  // ─── Incomes ────────────────────────────────────────────────────────────────

  @Get('incomes')
  getIncomes(@Request() req, @Query('type') type?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    const skip = (Number(page || 1) - 1) * Number(limit || 20);
    return this.walletService.getIncomes(req.user.sub, type, skip, Number(limit || 20));
  }

  // ─── Deposit Addresses ──────────────────────────────────────────────────────

  @Post('deposit-address')
  getOrCreateDepositAddress(@Request() req, @Body() body: { network: string }) {
    return this.walletService.getOrCreateDepositAddress(req.user.sub, body.network);
  }

  @Post('deposit/submit')
  submitDeposit(@Request() req, @Body() body: { amount: number; network: string; txHash: string }) {
    return this.walletService.submitDeposit(req.user.sub, body.amount, body.network, body.txHash);
  }

  // ─── Wallet Addresses ───────────────────────────────────────────────────────

  @Get('addresses')
  getWalletAddresses(@Request() req) {
    return this.walletService.getWalletAddresses(req.user.sub);
  }

  @Post('addresses')
  addWalletAddress(@Request() req, @Body() body: { walletType: string; address: string }) {
    return this.walletService.addWalletAddress(req.user.sub, body);
  }

  @Delete('addresses/:id')
  deleteWalletAddress(@Request() req, @Param('id') id: string) {
    return this.walletService.deleteWalletAddress(id, req.user.sub);
  }
}
