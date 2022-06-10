import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main(): Promise<void> {
  await db.programmingLanguage.createMany({
    data: [
      {
        name: 'dart',
        extension: 'dart',
      },
      {
        name: 'typescript',
        extension: 'ts',
      },
      {
        name: 'csharp',
        extension: 'cs',
      },
      {
        name: 'golang',
        extension: 'go',
      },
      {
        name: 'rust',
        extension: 'rs',
      },
      {
        name: 'javascript',
        extension: 'js',
      },
      {
        name: 'java',
        extension: 'java',
      },
      {
        name: 'php',
        extension: 'php',
      },
      {
        name: 'ruby',
        extension: 'rb',
      },
      {
        name: 'elixir',
        extension: 'ex',
      },
      {
        name: 'kotlin',
        extension: 'kt',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
