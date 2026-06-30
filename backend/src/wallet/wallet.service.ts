import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CryptoService } from './crypto.service';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
  ) {}

  // ─── Balance ───────────────────────────────────────────────────────────────

  async getBalance(userId: string) {
    return this.prisma.wallet.findUnique({ where: { userId } });
  }

  // ─── Deposit ────────────────────────────────────────────────────────────────

  async deposit(userId: string, amount: number, walletType: string = 'mineBalance') {
    this.validateAmount(amount);
    this.validateWalletType(walletType);

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { userId },
        data: { [walletType]: { increment: amount } },
      });

      await tx.transaction.create({
        data: { userId, amount, type: 'DEPOSIT', walletType, status: 'SUCCESS' },
      });

      return wallet;
    });
  }

  async submitDeposit(userId: string, amount: number, network: string, txHash: string) {
    this.validateAmount(amount);
    if (!txHash) throw new BadRequestException('Transaction Hash is required');

    // Ensure txHash isn't already used
    const existingTx = await this.prisma.transaction.findUnique({ where: { txHash } });
    if (existingTx) throw new BadRequestException('Transaction hash already submitted');

    return this.prisma.transaction.create({
      data: {
        userId,
        amount,
        type: 'DEPOSIT',
        walletType: 'mineBalance', // All crypto deposits go to mineBalance
        note: `Network: ${network}`,
        txHash,
        status: 'PENDING', // Needs admin approval
      },
    });
  }

  // ─── Withdraw ───────────────────────────────────────────────────────────────

  async withdraw(userId: string, amount: number, walletType: string = 'mineBalance') {
    this.validateAmount(amount);
    this.validateWalletType(walletType);

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet[walletType] < amount) {
        throw new BadRequestException(`Insufficient balance in ${walletType}`);
      }

      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { [walletType]: { decrement: amount } },
      });

      await tx.transaction.create({
        data: { userId, amount, type: 'WITHDRAW', walletType, status: 'SUCCESS' },
      });

      return updatedWallet;
    });
  }

  // ─── Transfer ───────────────────────────────────────────────────────────────

  async transfer(userId: string, amount: number, targetWallet: string) {
    this.validateAmount(amount);
    const validTargets = ['nodeBalance', 'capitalBalance'];
    if (!validTargets.includes(targetWallet)) {
      throw new BadRequestException('Invalid target wallet. Must be nodeBalance or capitalBalance');
    }

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet.mineBalance < amount) {
        throw new BadRequestException('Insufficient Mine Wallet balance for transfer');
      }

      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          mineBalance: { decrement: amount },
          [targetWallet]: { increment: amount },
        },
      });

      await tx.transaction.create({
        data: {
          userId,
          amount,
          type: 'TRANSFER',
          walletType: 'mineBalance',
          note: `Transfer to ${targetWallet}`,
          status: 'SUCCESS',
        },
      });

      return updatedWallet;
    });
  }

  // ─── Transactions ───────────────────────────────────────────────────────────

  async getTransactions(userId: string, type?: string, skip: number = 0, take: number = 20) {
    const where: any = { userId };
    if (type) where.type = type;

    const data = await this.prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
    
    const total = await this.prisma.transaction.count({ where });
    return { data, total, page: Math.floor(skip / take) + 1, totalPages: Math.ceil(total / take) };
  }

  // ─── Incomes ────────────────────────────────────────────────────────────────

  async getIncomes(userId: string, incomeType?: string, skip: number = 0, take: number = 20) {
    const where: any = { userId };
    if (incomeType) where.incomeType = incomeType;

    const data = await this.prisma.income.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
    
    const total = await this.prisma.income.count({ where });
    return { data, total, page: Math.floor(skip / take) + 1, totalPages: Math.ceil(total / take) };
  }

  // ─── Wallet Addresses ───────────────────────────────────────────────────────

  async getWalletAddresses(userId: string) {
    return this.prisma.walletAddress.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Deposit Addresses ──────────────────────────────────────────────────────

  async getOrCreateDepositAddress(userId: string, network: string) {
    if (!network) throw new BadRequestException('Network is required');

    const existing = await this.prisma.depositAddress.findUnique({
      where: { userId_network: { userId, network } },
    });

    if (existing) return existing;

    const newAddress = this.cryptoService.generateDepositAddress(network);

    return this.prisma.depositAddress.create({
      data: {
        userId,
        network,
        address: newAddress,
      },
    });
  }

  async addWalletAddress(userId: string, data: { walletType: string; address: string }) {
    if (!data.address || data.address.trim().length < 10) {
      throw new BadRequestException('Invalid wallet address');
    }

    const existing = await this.prisma.walletAddress.findFirst({
      where: { userId, address: data.address },
    });
    if (existing) throw new BadRequestException('This address is already saved');

    return this.prisma.walletAddress.create({
      data: {
        userId,
        walletType: data.walletType || 'USDT.BEP20',
        address: data.address.trim(),
        status: 'Available',
      },
    });
  }

  async deleteWalletAddress(id: string, userId: string) {
    const record = await this.prisma.walletAddress.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Wallet address not found');
    if (record.userId !== userId) throw new BadRequestException('Unauthorized');

    return this.prisma.walletAddress.delete({ where: { id } });
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private validateAmount(amount: number) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }
  }

  private validateWalletType(walletType: string) {
    const valid = ['mineBalance', 'nodeBalance', 'capitalBalance'];
    if (!valid.includes(walletType)) {
      throw new BadRequestException(`Invalid wallet type: ${walletType}`);
    }
  }
}
