import {
  AnalysisId,
  AnalysisRepositoryToken,
  AnalysisType,
  IAnalysisRepository,
  Vote,
} from '@codebarker/domain';
import { TestingFactory } from '@codebarker/shared';

import { AnalysisBuilder } from '../../../utils/AnalysisBuilder';
import { InfrastructureModule } from '../../../../src/lib/InfrastructureModule';
import { PrismaService } from '../../../../src/lib/drivers/prisma/PrismaService';
import { UserBuilder } from '../../../utils/UserBuilder';

describe('prisma analysis repository impl', () => {
  const USER_ID = 'userId';
  let builder: AnalysisBuilder;
  let userBuilder: UserBuilder;
  let sut: IAnalysisRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const container = TestingFactory.createContainer(InfrastructureModule);

    prisma = container.get(PrismaService);
    sut = container.get<IAnalysisRepository>(AnalysisRepositoryToken);
    builder = new AnalysisBuilder(sut, USER_ID);
    userBuilder = new UserBuilder(prisma);

    await userBuilder.buildAndPersist();
  });

  afterEach(async () => {
    await prisma.analysisVotes.deleteMany();
    await prisma.analysis.deleteMany();
    await prisma.content.deleteMany();
  });

  describe('get paginated analysis details for user async', () => {
    test('has more analyses when there are more left', async () => {
      await builder
        .setId(AnalysisId.make({ value: '1' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: '2' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: '3' }))
        .withContent()
        .buildAndPersist();

      const result = await sut.getPaginatedAnalysisDetailsForUserAsync(
        USER_ID,
        0,
        2
      );

      expect(result.hasMore).toBe(true);
    });

    test('has no more left when we queried all of them', async () => {
      await builder
        .setId(AnalysisId.make({ value: '1' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: '2' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: '3' }))
        .withContent()
        .buildAndPersist();

      const result = await sut.getPaginatedAnalysisDetailsForUserAsync(
        USER_ID,
        0,
        3
      );

      expect(result.hasMore).toBe(false);
    });

    test('returns exactly 3 analyses when asking for 4 but there are only 3 available', async () => {
      await builder
        .setId(AnalysisId.make({ value: '1' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: '2' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: '3' }))
        .withContent()
        .buildAndPersist();

      const result = await sut.getPaginatedAnalysisDetailsForUserAsync(
        USER_ID,
        0,
        4
      );

      expect(result.details.length).toBe(3);
    });

    test('skips the first two when amount is two and cursor is one', async () => {
      await builder
        .setId(AnalysisId.make({ value: '1' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: '2' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: '3' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: '4' }))
        .withContent()
        .buildAndPersist();

      const result = await sut.getPaginatedAnalysisDetailsForUserAsync(
        USER_ID,
        1,
        2
      );

      expect(result.details.at(0)?.analysisId).toBe('3');
      expect(result.details.at(1)?.analysisId).toBe('4');
    });
  });

  describe('get analysis details', () => {
    test.todo('we will move this out');
  });

  describe('get by id async', () => {
    test('returns the specific analysis', async () => {
      const analysis = await builder
        .setId(AnalysisId.make({ value: 'analysisId' }))
        .withContent()
        .buildAndPersist();
      await builder
        .setId(AnalysisId.make({ value: 'analysisId2' }))
        .withContent()
        .buildAndPersist();

      const result = await sut.getByIdAsync(analysis.id);

      expect(result!.id.value).toBe(analysis.id.value);
    });
  });

  describe('save async', () => {
    test('persists an analysis', async () => {
      const analysis = builder
        .setId(AnalysisId.make({ value: 'analysisId' }))
        .withContent()
        .build();

      await sut.saveAsync(analysis);

      const confirmation = await sut.getByIdAsync(analysis.id);
      expect(confirmation).toEqual(analysis);
    });

    test('only adds new votes but does not delete them', async () => {
      const user = await userBuilder
        .setId('userId2')
        .setEmail('john@foe.com')
        .setName('john foe')
        .buildAndPersist();

      const userThree = await userBuilder
        .setId('userId3')
        .setEmail('three@foe.com')
        .setName('three foe')
        .buildAndPersist();

      const analysis = await builder
        .setId(AnalysisId.make({ value: 'analysisId' }))
        .withContent()
        .withVote({ userId: UserBuilder.USER_ID })
        .withVote({ userId: user.id })
        .buildAndPersist();

      await sut.saveAsync(analysis);

      const pretendWeFetchedAnalysisWithoutLoadingVotes = (): void => {
        analysis.votes.length = 0;
      };

      pretendWeFetchedAnalysisWithoutLoadingVotes();

      analysis.addVote(
        Vote.make({
          type: AnalysisType.Agree,
          userId: userThree.id,
        })
      );

      expect(analysis.votes.at(0)!.userId.value).toBe(userThree.id.value);

      await sut.saveAsync(analysis);

      const confirmation = await sut.getByIdAsync(analysis.id);

      expect(confirmation!.votes.length).toBe(3);
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});
