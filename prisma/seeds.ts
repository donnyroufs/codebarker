import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main(): Promise<void> {
  await db.user.create({
    data: {
      id: 'userId',
    },
  });

  await db.solution.createMany({
    data: [
      {
        id: '1',
        type: 1,
      },
      {
        id: '2',
        type: 4,
      },
      {
        id: '3',
        type: 0,
      },
    ],
  });

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

  await db.kata.create({
    data: {
      id: '058e8ba6-217b-4ddc-a018-20684e340211',
      content: {
        create: {
          id: 'f9db035e-7411-4ac2-822a-4d2654ebcdf2',
          lines: [
            {
              line: 1,
              content: 'int basePrice = quantity * itemPrice;',
              isInfected: false,
            },
            {
              line: 2,
              content: 'double seasonDiscount = this.GetSeasonalDiscount();',
              isInfected: false,
            },
            {
              line: 3,
              content: 'double fees = this.GetFees();',
              isInfected: false,
            },
            {
              line: 4,
              content:
                'double finalPrice = DiscountedPrice(basePrice, seasonDiscount, fees);',
              isInfected: true,
            },
          ],
          programmingLanguage: {
            connect: {
              extension_name: {
                extension: 'cs',
                name: 'csharp',
              },
            },
          },
        },
      },
      solution: {
        connect: {
          id: '1',
        },
      },
    },
  });

  await db.kata.create({
    data: {
      id: '0ecc6bc3-fc50-4ffe-88f0-4b5a8838d112',
      content: {
        create: {
          id: '1e132e81-9210-47f3-91cd-cd2364d0eb4a',
          lines: [
            {
              line: 1,
              content: 'function logUser(',
            },
            {
              line: 2,
              content: '  id: number,',
            },
            {
              line: 3,
              content: '  firstName: string,',
            },
            {
              line: 4,
              content: '  lastName: string,',
            },
            {
              line: 5,
              content: '  fullName: string,',
            },
            {
              line: 6,
              content: '  age: number,',
            },
            {
              line: 7,
              content: '  country: string',
            },
            {
              line: 8,
              content: '): void {',
            },
            {
              line: 9,
              content: '  console.log({',
            },
            {
              line: 10,
              content: '    id,',
            },
            {
              line: 11,
              content: '    firstName,',
            },
            {
              line: 12,
              content: '    lastName,',
            },
            {
              line: 13,
              content: '    fullName,',
            },
            {
              line: 14,
              content: '    age,',
            },
            {
              line: 15,
              content: '    country,',
            },
            {
              line: 16,
              content: '  });',
            },
            {
              line: 17,
              content: '}',
            },
          ],
          programmingLanguage: {
            connect: {
              extension_name: {
                extension: 'ts',
                name: 'typescript',
              },
            },
          },
        },
      },
      solution: {
        create: {
          id: '1a22fd0b-9cb9-4a48-a52d-c99864b4e1ef',
          type: 1,
        },
      },
    },
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
