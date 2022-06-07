import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import { TestingFactory, ValidationException } from '@codebarker/shared';
import {
  AnalysisRepositoryToken,
  AnalysisStatus,
  AnalysisType,
  IAnalysisRepository,
  CannotVoteOnAnalysisException,
  HasAlreadyVotedException,
  OwnersCannotVoteOnTheirOwnAnalysisException,
  IKataRepository,
  KataRepositoryToken,
} from '@codebarker/domain';

import {
  AnalysisDoesNotExistException,
  ApplicationModule,
  ILogger,
  VoteOnAnalysisUseCase,
  LoggerToken,
} from '../../../src';
import {
  AnalysisFactory,
  VoteOnAnalysisRequestFactory,
  VoteFactory,
  KataFactory,
  SolutionFactory,
} from '../../utils';

describe('vote on analysis', () => {
  const mockedRepo = mock<IAnalysisRepository>();
  const mockedKataRepo = mock<IKataRepository>();

  let container: Container;
  let sut: VoteOnAnalysisUseCase;

  beforeAll(() => {
    const mockedLogger = mock<ILogger>();
    container = TestingFactory.createContainer(ApplicationModule);
    container
      .bind<IAnalysisRepository>(AnalysisRepositoryToken)
      .toConstantValue(mockedRepo);
    container.bind(LoggerToken).toConstantValue(mockedLogger);
    container
      .bind<IKataRepository>(KataRepositoryToken)
      .toConstantValue(mockedKataRepo);
  });

  beforeEach(() => {
    mockReset(mockedRepo);
    mockReset(mockedKataRepo);

    mockedKataRepo.generateId.mockReturnValue('some-generated-id');
    sut = container.get(VoteOnAnalysisUseCase);
  });

  test.each(VoteOnAnalysisRequestFactory.makeBadInput())(
    'throws a validation exception when the input is invalid',
    async (request) => {
      mockedRepo.getByIdAsync.mockResolvedValue(AnalysisFactory.make());
      const act = (): Promise<void> => sut.execute(request);

      expect(act).rejects.toThrowError(ValidationException);
    }
  );

  test('throws an exception when the analysis does not exist', async () => {
    const request = VoteOnAnalysisRequestFactory.make();

    mockedRepo.getByIdAsync.mockResolvedValueOnce(null);
    const act = (): Promise<void> => sut.execute(request);

    expect(act).rejects.toThrowError(AnalysisDoesNotExistException);
    expect(mockedRepo.getByIdAsync).toHaveBeenCalledWith(request.id);
  });

  test.each([
    AnalysisFactory.make({ status: AnalysisStatus.Declined }),
    AnalysisFactory.make({
      status: AnalysisStatus.Accepted,
    }),
  ])('throws an exception when the analysis is not pending', async (entity) => {
    const request = VoteOnAnalysisRequestFactory.make({
      userId: 'uniqueUserId',
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(entity);

    const act = (): Promise<void> => sut.execute(request);

    expect(act).rejects.toThrowError(CannotVoteOnAnalysisException);
  });

  test('throws an exception when trying to cast a vote when the user has already voted', async () => {
    const userId = 'myUserId';
    const request = VoteOnAnalysisRequestFactory.make({
      userId,
    });
    const entity = AnalysisFactory.make({
      userId: 'someUniqueUser',
      status: AnalysisStatus.Pending,
      votes: [
        VoteFactory.make({
          type: AnalysisType.Agree,
          userId,
        }),
      ],
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(entity);

    const act = (): Promise<void> => sut.execute(request);

    expect(act).rejects.toThrowError(HasAlreadyVotedException);
  });

  test('adds your vote', async () => {
    const userId = 'myUserId';
    const request = VoteOnAnalysisRequestFactory.make({
      userId,
      type: AnalysisType.Agree,
    });
    const entity = AnalysisFactory.make({
      userId: 'someUniqueUser',
      status: AnalysisStatus.Pending,
      votes: [],
    });
    const expectedEntity = AnalysisFactory.make({
      ...entity,
      votes: [
        VoteFactory.make({
          type: request.type,
          userId: request.userId,
        }),
      ],
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(entity);

    await sut.execute(request);

    expect(mockedRepo.saveAsync).toHaveBeenCalledWith(expectedEntity);
  });

  test.each([
    ['accepted', VoteFactory.make({ userId: '10', type: AnalysisType.Agree })],
    [
      'declined',
      VoteFactory.make({ userId: '10', type: AnalysisType.Disagree }),
    ],
  ])(
    'changes status to %s when above given threshold',
    async (_, decidingVote) => {
      const request = VoteOnAnalysisRequestFactory.make({
        userId: decidingVote.userId,
        type: decidingVote.type,
      });
      const votes = [
        VoteFactory.make({
          type: AnalysisType.Agree,
          userId: '1',
        }),
        VoteFactory.make({
          type: AnalysisType.Agree,
          userId: '2',
        }),
        VoteFactory.make({
          type: AnalysisType.Agree,
          userId: '3',
        }),
        VoteFactory.make({
          type: AnalysisType.Agree,
          userId: '4',
        }),
        VoteFactory.make({
          type: AnalysisType.Agree,
          userId: '5',
        }),
        VoteFactory.make({
          type: AnalysisType.Agree,
          userId: '6',
        }),
        VoteFactory.make({
          type: AnalysisType.Agree,
          userId: '7',
        }),
        VoteFactory.make({
          type: AnalysisType.Disagree,
          userId: '8',
        }),
        VoteFactory.make({
          type: AnalysisType.Disagree,
          userId: '9',
        }),
      ];
      const entity = AnalysisFactory.make({
        userId: 'userId',
        status: AnalysisStatus.Pending,
        votes: votes,
      });
      const expectedEntity = AnalysisFactory.make({
        ...entity,
        status: AnalysisStatus.Accepted,
        votes: [...votes, decidingVote],
      });

      mockedRepo.getByIdAsync.mockResolvedValueOnce(entity);

      await sut.execute(request);

      expect(mockedRepo.saveAsync).toHaveBeenCalledWith(expectedEntity);
    }
  );

  test('throws an exception when the owner attempts to vote on his own analysis', async () => {
    const userId = 'myUserId';
    const request = VoteOnAnalysisRequestFactory.make({
      userId,
      type: AnalysisType.Agree,
    });
    const entity = AnalysisFactory.make({
      userId,
      status: AnalysisStatus.Pending,
      votes: [],
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(entity);

    const act = (): Promise<void> => sut.execute(request);

    expect(act).rejects.toThrowError(
      OwnersCannotVoteOnTheirOwnAnalysisException
    );
  });

  test('persists a new kata when the analysis is accepted', async () => {
    const votes = VoteFactory.makeMany(9);

    const userId = 'myUserId';
    const request = VoteOnAnalysisRequestFactory.make({
      userId,
      type: AnalysisType.Agree,
    });
    const entity = AnalysisFactory.make({
      userId: 'someUniqueUser',
      status: AnalysisStatus.Pending,
      votes,
    });
    mockedKataRepo.generateId.mockReturnValue('generated-id');

    const kata = KataFactory.make({
      id: 'generated-id',
      content: entity.content,
      answers: [],
      solution: SolutionFactory.make({
        id: 'generated-id',
        type: entity.smell,
      }),
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(entity);

    await sut.execute(request);

    expect(mockedKataRepo.saveAsync).toHaveBeenCalledWith(kata);
  });

  test.todo('adds a notification that there has been voted');
});
