/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'changeMe123!';
  const username = (process.env.SEED_ADMIN_USERNAME ?? 'admin').toLowerCase();
  const name = process.env.SEED_ADMIN_NAME ?? 'Administrador';

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      username,
      name,
      password: hashedPassword
    }
  });

  console.log(`✔️ Usuario semilla verificado (${email}).`);
  if (!process.env.SEED_ADMIN_EMAIL) {
    console.log(`⚠️ Usa SEED_ADMIN_EMAIL/USERNAME/PASSWORD para personalizar la semilla. Contraseña actual: ${password}`);
  }
}

main()
  .catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
