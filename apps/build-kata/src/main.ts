import { PrismaClient } from '@prisma/client';
import * as Assets from './app/katas';

async function main(run: boolean): Promise<void> {
  if (!run) return;

  const prisma = new PrismaClient();
  const queries: any[] = Object.values(Assets).map((item) =>
    prisma.kata.create({
      data: item,
    })
  );

  await prisma.$transaction(queries).catch(console.error);
}

main(true);
