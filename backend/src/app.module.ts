import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { ReferralModule } from './referral/referral.module';
import { AdminModule } from './admin/admin.module';
import { PackagesModule } from './packages/packages.module';

@Module({
  imports: [AuthModule, WalletModule, ReferralModule, AdminModule, PackagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
