import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import {
  IKataRepository,
  KataRepositoryToken,
  Smell,
} from '@codebarker/domain';
import { TestingFactory, ValidationException } from '@codebarker/shared';

import { KataFactory, AnswerFactory, SolutionFactory } from '../../utils';

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
    container = TestingFactory.createContainer(ApplicationModule);
    container.bind(KataRepositoryToken).toConstantValue(mockedRepo);
  });

  beforeEach(() => {
    mockReset(mockedRepo);
    mockedRepo.generateId.mockReturnValue('generatedId');
    sut = container.get(SubmitKataUseCase);
  });

  test('returns that it was a success if the answer was correct', async () => {
    const request: ISubmitKataRequest = {
      answerId: 'answerId',
      kataId: 'kataId',
      userId: 'userId',
      smell: Smell.DataClump,
    };

    const kata = KataFactory.make({
      solution: SolutionFactory.make({
        id: request.answerId,
        type: request.smell,
      }),
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(kata);

    const result = await sut.execute(request);

    expect(result.isCorrect).toBe(true);
  });

  test('returns that it was not a success if the answer was incorrect', async () => {
    const request: ISubmitKataRequest = {
      answerId: 'answerId',
      kataId: 'kataId',
      userId: 'userId',
      smell: Smell.DataClump,
    };

    const kata = KataFactory.make({
      solution: SolutionFactory.make({
        id: 'wrong',
      }),
    });

    mockedRepo.getByIdAsync.mockResolvedValueOnce(kata);

    const result = await sut.execute(request);

    expect(result.isCorrect).toBe(false);
  });

  test('throws an unknown kata exception when the kata is not found', async () => {
    const request: ISubmitKataRequest = {
      answerId: 'answerId',
      kataId: 'kataId',
      userId: 'userId',
      smell: Smell.DataClump,
    };

    mockedRepo.getByIdAsync.mockResolvedValueOnce(null);

    const act = (): Promise<SubmitKataResponse> => sut.execute(request);

    expect(act).rejects.toThrowError(UnknownKataException);
  });

  test.each(inputData())(
    'throws a validation exception when the input is invalid',
    async (answerId: string, kataId: string, userId: string) => {
      const request: ISubmitKataRequest = {
        answerId,
        kataId,
        userId,
        smell: Smell.DataClump,
      };

      const act = (): Promise<SubmitKataResponse> => sut.execute(request);

      expect(act).rejects.toThrowError(ValidationException);
    }
  );

  test('saves the given answer', async () => {
    const request: ISubmitKataRequest = {
      answerId: 'answerId',
      kataId: 'kataId',
      userId: 'userId',
      smell: Smell.DataClump,
    };

    const solution = SolutionFactory.make({
      id: request.answerId,
    });

    const kata = KataFactory.make({
      solution,
    });

    const answer = AnswerFactory.make({
      id: 'generatedId',
      kataId: request.kataId,
      userId: request.userId,
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

function inputData(): any[] {
  return [
    ['answerId', 'kataId', 1],
    ['answerId', 1, 'userId'],
    [1, 'kataId', 'userId'],
  ];
}
