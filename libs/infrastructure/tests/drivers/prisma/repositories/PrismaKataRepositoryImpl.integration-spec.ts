import {
  Answer,
  Content,
  IKataRepository,
  Kata,
  KataRepositoryToken,
  ProgrammingLanguage,
  Smell,
  Solution,
} from '@codebarker/domain';
import { TestingFactory } from '@codebarker/shared';

import { PrismaService } from '../../../../src/lib/drivers/prisma/PrismaService';
import { InfrastructureModule } from '../../../../src/lib/InfrastructureModule';
import { KataBuilder } from '../../../utils/KataBuilder';

describe('prisma kata repository impl', () => {
  const USER_ID = 'userId';
  let builder: KataBuilder;
  let sut: IKataRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const container = TestingFactory.createContainer(InfrastructureModule);

    prisma = container.get(PrismaService);
    sut = container.get<IKataRepository>(KataRepositoryToken);
    builder = new KataBuilder(sut, USER_ID);

    await prisma.user.create({
      data: {
        id: USER_ID,
      },
    });
  });

  afterEach(async () => {
    await prisma.answer.deleteMany();
    await prisma.content.deleteMany();
    await prisma.kata.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('get programming language by extension', () => {
    test.each([
      ['ts', 'typescript'],
      ['cs', 'csharp'],
    ])(
      'returns the programming language for the given extension',
      async (ext, lang) => {
        const expectedLanguage = ProgrammingLanguage.make({
          name: lang,
          extension: ext,
        });

        const result = await sut.getProgrammingLanguageByExtAsync(ext);

        expect(result).toEqual(expectedLanguage);
      }
    );
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
      await builder.withContent().withSolution().buildAndPersist();
      await builder
        .setId('id2')
        .withContent({
          lines: [],
          programmingLanguage: ProgrammingLanguage.make({
            name: 'csharp',
            extension: 'cs',
          }),
        })
        .withSolution({
          id: 'id2',
          type: Smell.DataClass,
        })
        .buildAndPersist();

      const result = await sut.countByLanguages(['typescript', 'csharp']);

      expect(result).toBe(2);
    });

    test('returns a count of 2 when filtered by the languages TypeScript, Csharp and JavaScript', async () => {
      await builder.withContent().withSolution().buildAndPersist();
      await builder
        .setId('id2')
        .withContent({
          lines: [],
          programmingLanguage: ProgrammingLanguage.make({
            name: 'csharp',
            extension: 'cs',
          }),
        })
        .withSolution({
          id: 'id2',
          type: Smell.DataClass,
        })
        .buildAndPersist();

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
      const kata = await builder
        .withAnswer()
        .withContent()
        .withSolution()
        .buildAndPersist();

      const savedKata = await sut.getByIdAsync(kata.id);
      const savedAnswers = await prisma.answer.findMany({
        where: {
          kataId: kata.id,
        },
      });

      expect(savedKata).toBeDefined();
      expect(savedKata).toBeInstanceOf(Kata);
      expect(savedKata!.id).toBe(kata.id);
      expect(savedKata!.content.equals(kata.content));
      expect(savedAnswers).toEqual(kata.answers);
      expect(savedKata!.solution.type).toBe(kata.solution.type);
    });

    test('previous answers do not get deleted when adding new ones while not including the previous ones', async () => {
      const kata = await builder
        .withAnswer()
        .withContent()
        .withSolution()
        .buildAndPersist();

      kata.addAnswer(
        Answer.make({
          id: 'answerId2',
          isCorrect: false,
          kataId: kata.id,
          smell: Smell.DataClass,
          userId: USER_ID,
        })
      );
      await sut.saveAsync(kata);

      const confirmation = await prisma.answer.findMany({
        where: {
          kataId: kata.id,
        },
      });
      expect(confirmation).toEqual(kata.answers);
    });

    test('do not remove answers when none given', async () => {
      const kata = await builder
        .withAnswer()
        .withContent()
        .withSolution()
        .buildAndPersist();

      const sameKataWithoutAnswers = await builder
        .withContent()
        .withSolution()
        .buildAndPersist();

      await sut.saveAsync(sameKataWithoutAnswers);

      const confirmation = await prisma.answer.findMany({
        where: {
          kataId: kata.id,
        },
      });
      expect(kata.answers).toEqual(confirmation);
    });
  });

  describe('get by id async', () => {
    test('gets kata without answers', async () => {
      const createdKata = await builder
        .withAnswer()
        .withContent()
        .withSolution()
        .buildAndPersist();

      const kata = await sut.getByIdAsync(createdKata.id);

      const createdKataWithoutAnswers = await builder
        .withContent()
        .withSolution()
        .buildAndPersist();
      expect(kata).toEqual(createdKataWithoutAnswers);
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
