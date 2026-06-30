import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async getAllPackages() {
    return this.prisma.package.findMany();
  }

  async getPackageById(id: string) {
    return this.prisma.package.findUnique({ where: { id } });
  }

  async purchasePackage(userId: string, packageId: string) {
    const pkg = await this.prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) throw new BadRequestException('Package not found');

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet.mineBalance < pkg.price) {
        throw new BadRequestException('Insufficient mine balance to purchase package');
      }

      await tx.wallet.update({
        where: { userId },
        data: { mineBalance: { decrement: pkg.price } }
      });

      const userPackage = await tx.userPackage.create({
        data: {
          userId,
          packageId: pkg.id,
          status: 'ACTIVE'
        }
      });

      await tx.transaction.create({
        data: {
          userId,
          amount: pkg.price,
          type: 'PURCHASE',
          walletType: 'mineBalance',
          note: `Purchased package: ${pkg.name}`,
          status: 'SUCCESS'
        }
      });

      return userPackage;
    });
  }

  async getUserPackages(userId: string) {
    return this.prisma.userPackage.findMany({
      where: { userId }
    });
  }
}
