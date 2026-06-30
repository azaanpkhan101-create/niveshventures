import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('Successfully connected to the database');
        break;
      } catch (err) {
        this.logger.error(`Database connection failed. Retries left: ${retries - 1}`, err.message);
        retries -= 1;
        if (retries === 0) throw err;
        // Wait 3 seconds before retrying to allow Supabase to wake up
        await new Promise(res => setTimeout(res, 3000));
      }
    }
  }
}
