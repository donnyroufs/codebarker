import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import {
  AnswerId,
  IKataRepository,
  KataId,
  KataRepositoryToken,
  Smell,
  UserId,
} from '@codebarker/domain';
import { TestingFactory, ValidationException } from '@codebarker/shared';

import { KataFactory, AnswerFactory, SolutionFactory } from '../../utils';
import { ILogger, LoggerToken } from '../../../src/lib/interfaces';

import {
  SubmitKataUseCase,
  ISubmitKataRequest,
  SubmitKataResponse,
  UnknownKataException,
} from '../../../src/lib/useCases/submitKataUsecase';
import { ApplicationModule } from '../../../src/lib/ApplicationModule';

describe('Submit kata', () => {
  const mockedRepo = mock<IKataRepository>();

  let sut: SubmitKataUseCase;
  let container: Container;

  beforeAll(() => {
    const mockedLogger = mock<ILogger>();
    container = TestingFactory.createContainer(ApplicationModule);
    container.bind(KataRepositoryToken).toConstantValue(mockedRepo);
    container.bind(LoggerToken).toConstantValue(mockedLogger);
  });

  beforeEach(() => {
    mockReset(mockedRepo);
    mockedRepo.generateId.mockReturnValue(
      KataId.make({ value: 'generatedId' })
    );
    sut = container.get(SubmitKataUseCase);
  });

  test('returns that it was a success if the answer was correct', async () => {
    const request: ISubmitKataRequest = {
      kataId: 'kataId',
      userId: 'userId',
      smell: Smell.DataClump,
    };

    const kata = KataFactory.make({
      solution: SolutionFactory.make({
        type: request.smell,
      }),
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(kata);

    const result = await sut.execute(request);

    expect(result.isCorrect).toBe(true);
  });

  test('returns that it was not a success if the answer was incorrect', async () => {
    const request: ISubmitKataRequest = {
      kataId: 'kataId',
      userId: 'userId',
      smell: Smell.DataClump,
    };

    const kata = KataFactory.make({
      solution: SolutionFactory.make({
        type: Smell.DataClass,
      }),
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(kata);

    const result = await sut.execute(request);

    expect(result.isCorrect).toBe(false);
  });

  test('throws an unknown kata exception when the kata is not found', async () => {
    const request: ISubmitKataRequest = {
      kataId: 'kataId',
      userId: 'userId',
      smell: Smell.DataClump,
    };

    mockedRepo.getByIdAsync.mockResolvedValueOnce(null);

    const act = (): Promise<SubmitKataResponse> => sut.execute(request);

    expect(act).rejects.toThrowError(UnknownKataException);
  });

  test('saves the given answer', async () => {
    const request: ISubmitKataRequest = {
      kataId: 'kataId',
      userId: 'userId',
      smell: Smell.DataClump,
    };

    const solution = SolutionFactory.make({
      type: Smell.DataClump,
    });

    const kata = KataFactory.make({
      solution,
    });

    const answer = AnswerFactory.make({
      id: AnswerId.make({ value: 'generatedId' }),
      kataId: KataId.make({ value: request.kataId }),
      userId: UserId.make({ value: request.userId }),
      isCorrect: true,
    });

    const kataToBePersisted = KataFactory.make({
      solution,
      answers: [answer],
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(kata);

    await sut.execute(request);

    expect(mockedRepo.saveAsync).toHaveBeenCalledWith(kataToBePersisted);
  });
});