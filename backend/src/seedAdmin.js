const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial admin account...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@muka.com' },
    update: {},
    create: {
      email: 'admin@muka.com',
      password: hashedPassword,
      fullName: 'System Administrator',
      role: 'ADMIN'
    }
  });
  
  console.log('Admin account (admin@muka.com) with password (admin123) successfully verified/created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
