import {
  Answer,
  Content,
  IKataRepository,
  Kata,
  KataRepositoryToken,
  Line,
  ProgrammingLanguage,
  Smell,
  Solution,
} from '@codebarker/domain';
import { TestingFactory } from '@codebarker/shared';

import { PrismaService } from '../../../../src/lib/drivers/prisma/PrismaService';
import { InfrastructureModule } from '../../../../src/lib/InfrastructureModule';

describe('prisma kata repository impl', () => {
  let sut: IKataRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const container = TestingFactory.createContainer(InfrastructureModule);

    prisma = container.get(PrismaService);
    sut = container.get<IKataRepository>(KataRepositoryToken);
  });

  afterEach(async () => {
    await prisma.answer.deleteMany();
    await prisma.content.deleteMany();
    await prisma.kata.deleteMany();
    await prisma.user.deleteMany();
  });

  test('generates a random id', () => {
    const first = sut.generateId();
    const second = sut.generateId();

    expect(first).not.toBe(second);
  });

  describe('count by languages', () => {
    test('returns a count of 1 when there is content with the language TypeScript', async () => {
      await sut.saveAsync(
        Kata.make({
          id: 'id',
          answers: [],
          content: Content.make({
            lines: [],
            programmingLanguage: ProgrammingLanguage.make({
              name: 'typescript',
              extension: 'ts',
            }),
          }),
          solution: Solution.make({
            id: 'id',
            type: Smell.DataClass,
          }),
        })
      );
      const result = await sut.countByLanguages(['typescript']);

      expect(result).toBe(1);
    });

    test('returns a count of 0 when there is no content with the language TypeScript', async () => {
      const result = await sut.countByLanguages(['typescript']);

      expect(result).toBe(0);
    });

    test('returns a count of 2 when there is content with the languages TypeScript and Csharp', async () => {
      await sut.saveAsync(
        Kata.make({
          id: 'id',
          answers: [],
          content: Content.make({
            lines: [],
            programmingLanguage: ProgrammingLanguage.make({
              name: 'typescript',
              extension: 'ts',
            }),
          }),
          solution: Solution.make({
            id: 'id',
            type: Smell.DataClass,
          }),
        })
      );
      await sut.saveAsync(
        Kata.make({
          id: 'id2',
          answers: [],
          content: Content.make({
            lines: [],
            programmingLanguage: ProgrammingLanguage.make({
              name: 'csharp',
              extension: 'cs',
            }),
          }),
          solution: Solution.make({
            id: 'id2',
            type: Smell.DataClass,
          }),
        })
      );

      const result = await sut.countByLanguages(['typescript', 'csharp']);

      expect(result).toBe(2);
    });
    test('returns a count of 2 when there is content with the languages TypeScript, Csharp and JavaScript', async () => {
      await sut.saveAsync(
        Kata.make({
          id: 'id',
          answers: [],
          content: Content.make({
            lines: [],
            programmingLanguage: ProgrammingLanguage.make({
              name: 'typescript',
              extension: 'ts',
            }),
          }),
          solution: Solution.make({
            id: 'id',
            type: Smell.DataClass,
          }),
        })
      );
      await sut.saveAsync(
        Kata.make({
          id: 'id2',
          answers: [],
          content: Content.make({
            lines: [],
            programmingLanguage: ProgrammingLanguage.make({
              name: 'csharp',
              extension: 'cs',
            }),
          }),
          solution: Solution.make({
            id: 'id2',
            type: Smell.DataClass,
          }),
        })
      );

      const result = await sut.countByLanguages([
        'typescript',
        'csharp',
        'javascript',
      ]);

      expect(result).toBe(2);
    });
  });

  describe('save async', () => {
    test('saves a new kata', async () => {
      const id = 'id';
      const line = Line.make(1, 'my first line', false);
      const lineTwo = Line.make(2, 'my second line', true);
      const content = Content.make({
        lines: [line, lineTwo],
        programmingLanguage: ProgrammingLanguage.make({
          name: 'typescript',
          extension: 'ts',
        }),
      });
      await prisma.user.create({
        data: {
          id: 'userId',
        },
      });

      const answer = Answer.make({
        id: 'answerId',
        isCorrect: false,
        kataId: id,
        smell: Smell.Comments,
        userId: 'userId',
      });
      const answers: Answer[] = [answer];
      const solution = Solution.make({
        id: 'id',
        type: Smell.DataClass,
      });

      const kata = Kata.make({
        id,
        answers,
        content,
        solution,
      });

      await sut.saveAsync(kata);

      const savedKata = await sut.getByIdAsync(id);
      const savedAnswers = await prisma.answer.findMany({
        where: {
          kataId: id,
        },
      });

      expect(savedKata).toBeDefined();
      expect(savedKata).toBeInstanceOf(Kata);
      expect(savedKata!.id).toBe(id);
      expect(savedKata!.content.equals(content));
      expect(savedAnswers).toEqual(kata.answers);
      expect(savedKata!.solution.type).toBe(kata.solution.type);
    });

    test.todo(
      'previous answers do not get deleted when adding new ones while not including the previous ones'
    );
    test.todo('reverts changes when something went wrong');
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});