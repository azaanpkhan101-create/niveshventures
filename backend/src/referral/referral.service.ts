import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  async getReferralStats(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { message: 'User not found' };

    const referredUsers = await this.prisma.user.findMany({
      where: { referredBy: user.referralCode },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    const totalBonus = await this.prisma.transaction.aggregate({
      where: { userId, type: 'BONUS' },
      _sum: { amount: true }
    });

    return {
      referralCode: user.referralCode,
      totalReferred: referredUsers.length,
      totalBonus: totalBonus._sum.amount || 0,
      referredUsers
    };
  }
}
