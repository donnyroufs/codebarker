import {
  Answer,
  IKataRepository,
  Kata,
  KataRepositoryToken,
  ProgrammingLanguage,
  Smell,
} from '@codebarker/domain';
import { TestingFactory } from '@codebarker/shared';

import { PrismaService } from '../../../../src/lib/drivers/prisma/PrismaService';
import { InfrastructureModule } from '../../../../src/lib/InfrastructureModule';
import { KataBuilder } from '../../../utils/KataBuilder';
import { UserBuilder } from '../../../utils/UserBuilder';


describe('prisma kata repository impl', () => {
  let userBuilder: UserBuilder
  let builder: KataBuilder;
  let sut: IKataRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const container = TestingFactory.createContainer(InfrastructureModule);

    prisma = container.get(PrismaService);
    sut = container.get<IKataRepository>(KataRepositoryToken);
    builder = new KataBuilder(sut, UserBuilder.USER_ID);
    userBuilder = new UserBuilder(prisma)

    await userBuilder.buildAndPersist()
  });

  afterEach(async () => {
    await prisma.answer.deleteMany();
    await prisma.content.deleteMany();
    await prisma.kata.deleteMany();
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

  describe('get async', () => {
    test('returns a kata', async () => {
      // prettier-ignore
      await builder
        .withAnswer()
        .withContent()
        .withSolution()
        .buildAndPersist()

      const result = await sut.getAsync(UserBuilder.USER_ID);

      expect(result).toBeInstanceOf(Kata);
    });

    test('returns a different kata than before', async () => {
      const previousKata = await builder
        .withAnswer()
        .withContent()
        .withSolution()
        .buildAndPersist();

      // prettier-ignore
      await builder
        .setId('id2')
        .withContent()
        .withSolution({
          id: "solutionId2"
        })
        .buildAndPersist()
      // prettier-ignore
      await builder
          .setId('id3')
          .withContent()
          .withSolution({
            id: "solutionId3"
          })
          .buildAndPersist();

      const result = await sut.getAsync(UserBuilder.USER_ID, false, previousKata.id);

      expect(result!.id).not.toBe(previousKata.id);
    });

    test('returns a kata that has not yet been completed', async () => {
      await builder
        .setId('id')
        .withContent()
        .withSolution()
        .asCompleted()
        .buildAndPersist();

      const expectedKata = await builder
        .setId('id2')
        .withContent()
        .withSolution({
          id: 'solutionId2',
        })
        .buildAndPersist();

      const result = await sut.getAsync(UserBuilder.USER_ID, true);

      expect(result!.id).toBe(expectedKata.id);
    });

    test('returns a kata that is not completed', async () => {
      const completedKata = await builder
        .setId('id')
        .withTypeScriptContent()
        .withSolution()
        .asCompleted()
        .buildAndPersist();

      await builder
        .setId('id2')
        .withTypeScriptContent()
        .withAnswer({
          id: 'answerId',
          isCorrect: false,
        })
        .withSolution({
          id: 'solutionId2',
        })
        .buildAndPersist();

      await builder
        .setId('id3')
        .withTypeScriptContent()
        .withAnswer({
          id: 'answerId2',
          isCorrect: false,
        })
        .withSolution({
          id: 'solutionId3',
        })
        .buildAndPersist();

      const result = await sut.getAsync(UserBuilder.USER_ID, false, completedKata.id);

      expect(result!.answers.filter((answer) => answer.isCorrect).length).toBe(
        0
      );
    });

    test('returns null when there is no kata available in the current language', async () => {
      await builder
        .setId('id')
        .withTypeScriptContent()
        .withSolution()
        .asCompleted()
        .buildAndPersist();

      const result = await sut.getAsync(UserBuilder.USER_ID, false, undefined, ['csharp']);

      expect(result).toBe(null);
    });

    test('returns a kata when there is a kata for the given language', async () => {
      const expectedKata = await builder
        .setId('id')
        .withTypeScriptContent()
        .withSolution()
        .asCompleted()
        .buildAndPersist();

      const result = await sut.getAsync(UserBuilder.USER_ID, false, undefined, [
        'typescript',
      ]);

      expect(result).not.toBe(null);
      expect(result!.id).toBe(expectedKata.id);
    });

    test('returns a random kata', async () => {
      await builder
        .setId('id')
        .withTypeScriptContent()
        .withSolution()
        .buildAndPersist();

      await builder
        .setId('id2')
        .withTypeScriptContent()
        .withSolution({
          id: 'solutionId2',
        })
        .asCompleted()
        .buildAndPersist();

      const promises = [...new Array(30)].map(() =>
        sut.getAsync(UserBuilder.USER_ID, false, undefined, ['typescript'])
      );

      const katas = await Promise.all(promises);

      const seen = katas.reduce(
        (acc: any, curr: any) => {
          if (acc[curr.id] === false) {
            acc[curr.id] = true;
          }

          return acc;
        },
        {
          id: false,
          id2: false,
        }
      );

      expect(seen.id).toBe(true);
      expect(seen.id2).toBe(true);
    });
  });

  describe('count by languages', () => {
    test('returns a count of 1 when there is content with the language TypeScript', async () => {
      // prettier-ignore
      await builder
        .setId('id')
        .withTypeScriptContent()
        .withSolution()
        .buildAndPersist();

      await builder
        .setId('id')
        .withCSharpContent()
        .withSolution()
        .buildAndPersist();

      // prettier-ignore
      await builder
        .setId('id')
        .withContent()
        .withSolution()
        .buildAndPersist();

      const result = await sut.countByLanguages(['typescript']);

      expect(result).toBe(1);
    });

    test('returns a count of 0 when there is no content with the language TypeScript', async () => {
      const result = await sut.countByLanguages(['typescript']);

      expect(result).toBe(0);
    });

    test('returns a count of 2 when there is content with the languages TypeScript and Csharp', async () => {
      // prettier-ignore
      await builder
        .withContent()
        .withSolution()
        .buildAndPersist();

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
          userId: UserBuilder.USER_ID,
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
    await prisma.user.deleteMany()
    await prisma.$disconnect();
  });
});
