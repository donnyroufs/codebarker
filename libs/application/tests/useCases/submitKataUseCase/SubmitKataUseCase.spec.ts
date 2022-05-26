import { mock, mockReset } from 'jest-mock-extended';
import { None, Some } from 'ts-results';

import { IKataRepository } from '@codebarker/domain';
import { ValidationException } from '@codebarker/shared';

import { KataFactory } from '../../utils/KataFactory';

import {
  SubmitKataUseCase,
  ISubmitKataRequest,
  SubmitKataResponse,
  UnknownKataException,
} from '../../../src/lib/useCases/submitKataUsecase';

describe('Submit kata', () => {
  let sut: SubmitKataUseCase;
  const repoMock = mock<IKataRepository>();

  beforeAll(() => {
    mockReset(repoMock);
    sut = new SubmitKataUseCase(repoMock);
  });

  test('returns that it was a success if the answer was correct', async () => {
    const request: ISubmitKataRequest = {
      answerId: 'answerId',
      kataId: 'kataId',
      userId: 'userId',
    };

    const kata = KataFactory.make({
      solutionId: request.answerId,
    });

    repoMock.getByIdAsync.mockResolvedValueOnce(Some(kata));

    const result = await sut.execute(request);

    expect(result.isCorrect).toBe(true);
  });

  test('returns that it was not a success if the answer was incorrect', async () => {
    const request: ISubmitKataRequest = {
      answerId: 'answerId',
      kataId: 'kataId',
      userId: 'userId',
    };

    const kata = KataFactory.make({
      solutionId: 'wrongAnswer',
    });

    repoMock.getByIdAsync.mockResolvedValueOnce(Some(kata));

    const result = await sut.execute(request);

    expect(result.isCorrect).toBe(false);
  });

  test('throws an unknown kata exception when the kata is not found', async () => {
    const request: ISubmitKataRequest = {
      answerId: 'answerId',
      kataId: 'kataId',
      userId: 'userId',
    };

    repoMock.getByIdAsync.mockResolvedValueOnce(None);

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
    };

    const kata = KataFactory.make({
      solutionId: request.answerId,
    });

    repoMock.getByIdAsync.mockResolvedValueOnce(Some(kata));

    expect(repoMock.saveAsync).toHaveBeenCalledWith(kata);
  });
});

function inputData(): any[] {
  return [
    ['answerId', 'kataId', 1],
    ['answerId', 1, 'userId'],
    [1, 'kataId', 'userId'],
  ];
}
