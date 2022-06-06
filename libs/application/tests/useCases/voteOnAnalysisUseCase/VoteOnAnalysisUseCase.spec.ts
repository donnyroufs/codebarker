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
} from '../../utils';

describe('vote on analysis', () => {
  const mockedRepo = mock<IAnalysisRepository>();

  let container: Container;
  let sut: VoteOnAnalysisUseCase;

  beforeAll(() => {
    const mockedLogger = mock<ILogger>();
    container = TestingFactory.createContainer(ApplicationModule);
    container
      .bind<IAnalysisRepository>(AnalysisRepositoryToken)
      .toConstantValue(mockedRepo);
    container.bind(LoggerToken).toConstantValue(mockedLogger);
  });

  beforeEach(() => {
    mockReset(mockedRepo);

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
    const request = VoteOnAnalysisRequestFactory.make();

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
      userId,
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
      userId,
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

  test.todo('adds a notification that there has been voted');
});
