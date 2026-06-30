import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.transaction.deleteMany();
  await prisma.userPackage.deleteMany();
  await prisma.package.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  // Create Packages
  const p1 = await prisma.package.create({
    data: { name: 'Starter Node', type: 'SERVICE', price: 100, dailyReturn: 1.5, duration: 200 }
  });
  const p2 = await prisma.package.create({
    data: { name: 'Cloud Miner V1', type: 'MINING', price: 200, dailyReturn: 2.0, duration: 365 }
  });

  // Create Admin User
  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Master',
      email: 'admin@niveshventures.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      referralCode: 'ADMINX2024',
      isVerified: true,
      wallet: {
        create: {
          mineBalance: 15000.0,
          nodeBalance: 5000.0,
          capitalBalance: 25000.0,
        }
      }
    }
  });

  // Create Test User
  const testHash = await bcrypt.hash('test1234', 10);
  const testUser = await prisma.user.create({
    data: {
      name: 'Test Investor',
      email: 'test@niveshventures.com',
      passwordHash: testHash,
      role: 'USER',
      referralCode: 'TEST9999',
      referredBy: 'ADMINX2024',
      isVerified: true,
      wallet: {
        create: {
          mineBalance: 1250.50,
          nodeBalance: 340.20,
          capitalBalance: 890.00,
        }
      }
    }
  });

  // Create Transactions for Test User
  const txs = [
    { amount: 500, type: 'DEPOSIT', status: 'COMPLETED', userId: testUser.id },
    { amount: 15.5, type: 'income_service', status: 'COMPLETED', userId: testUser.id },
    { amount: 50, type: 'income_matching', status: 'COMPLETED', userId: testUser.id },
    { amount: 10, type: 'income_club', status: 'COMPLETED', userId: testUser.id },
    { amount: 100, type: 'WITHDRAW', status: 'PENDING', userId: testUser.id },
    { amount: 200, type: 'transfer_capital', status: 'SUCCESS', userId: testUser.id },
  ];

  for (const tx of txs) {
    await prisma.transaction.create({ data: tx });
  }

  // Create User Packages
  await prisma.userPackage.create({
    data: {
      userId: testUser.id,
      packageId: p1.id,
      status: 'ACTIVE'
    }
  });

  console.log('Database seeded successfully!');
  console.log('Test User Login: test@niveshventures.com / test1234');
  console.log('Admin Login: admin@niveshventures.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
