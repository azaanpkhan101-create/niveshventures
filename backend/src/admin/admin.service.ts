import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const totalTransactions = await this.prisma.transaction.count();
    
    const depositSum = await this.prisma.transaction.aggregate({
      where: { type: 'DEPOSIT', status: 'SUCCESS' },
      _sum: { amount: true }
    });

    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true, role: true, status: true }
    });

    return {
      totalUsers,
      totalTransactions,
      totalDeposits: depositSum._sum.amount || 0,
      recentUsers
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, wallet: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getUserDetails(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(id: string, data: { name?: string; email?: string; phone?: string; country?: string; status?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, status: true }
    });
  }

  async updateUserWallet(id: string, action: string, walletType: string, amount: number, note?: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    
    const validWallets = ['mineBalance', 'nodeBalance', 'capitalBalance'];
    if (!validWallets.includes(walletType)) throw new BadRequestException('Invalid wallet type');

    const user = await this.prisma.user.findUnique({ where: { id }, include: { wallet: true } });
    if (!user || !user.wallet) throw new NotFoundException('User or wallet not found');

    if (action === 'DEDUCT' && user.wallet[walletType] < amount) {
      throw new BadRequestException('Insufficient funds for deduction');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { userId: id },
        data: {
          [walletType]: action === 'DEPOSIT' ? { increment: amount } : { decrement: amount }
        }
      });

      await tx.transaction.create({
        data: {
          userId: id,
          amount,
          type: action === 'DEPOSIT' ? 'DEPOSIT' : 'WITHDRAW',
          walletType,
          note: note ? `Admin: ${note}` : `Admin manual ${action.toLowerCase()}`,
          status: 'SUCCESS'
        }
      });

      return updatedWallet;
    });
  }

  async resetUserPassword(id: string, newPassword: string) {
    if (newPassword.length < 6) throw new BadRequestException('Password must be at least 6 characters');
    
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash }
    });

    return { message: 'Password reset successfully' };
  }

  async getKycApplications() {
    // Returning dummy data since there is no KYC table yet
    return [
      { id: 'KYC-1029', name: 'John Doe', documentType: 'Passport', submittedAt: '2024-03-10', status: 'PENDING' },
      { id: 'KYC-1030', name: 'Jane Smith', documentType: 'Driver License', submittedAt: '2024-03-11', status: 'PENDING' },
    ];
  }

  async getReports() {
    // Fetching basic aggregated stats since we don't have historical snapshot tables
    const users = await this.prisma.user.count();
    const deposits = await this.prisma.transaction.aggregate({
      where: { type: 'DEPOSIT', status: 'SUCCESS' },
      _sum: { amount: true }
    });
    
    return {
      newUsers: users,
      newUsersGrowth: 12,
      totalVolume: deposits._sum.amount || 0,
      totalVolumeGrowth: 8,
      activeWallets: users,
    };
  }
}
