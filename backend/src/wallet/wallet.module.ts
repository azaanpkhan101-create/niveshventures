import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { CryptoService } from './crypto.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService, CryptoService, PrismaService],
  exports: [WalletService],
})
export class WalletModule {}
