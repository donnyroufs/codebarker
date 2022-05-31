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

  await db.kata.createMany({
    data: [
      {
        id: '38dc6b2f-d51f-4510-94a8-4e98f94ba86d',
        content: [
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
        solutionId: '1',
      },
      {
        id: '5595bc58-7e0f-4acb-93cd-8732adcff1ba',
        content: [
          { line: 1, content: '// sums 2 values' },
          {
            line: 2,
            content: 'const sum = (a: number, b:number): number => a + b;',
          },
        ],
        solutionId: '2',
      },
      {
        id: '666cec4b-9b84-453b-a155-815ab7047a5f',
        content: [
          { line: 1, content: 'class Booking {' },
          { line: 2, content: '  public constructor(' },
          { line: 3, content: '    public bookingId: number,' },
          { line: 4, content: '    public roomId: number,' },
          { line: 5, content: '    public from: Date,' },
          { line: 6, content: '    public to: Date' },
          { line: 7, content: '  ) {}' },
          { line: 8, content: '}' },
        ],
        solutionId: '3',
      },
    ],
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
