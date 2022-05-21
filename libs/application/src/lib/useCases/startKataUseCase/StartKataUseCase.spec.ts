import { mock, mockReset } from 'jest-mock-extended';

import { Kata, IKataRepository, KataProps } from '@codebarker/domain';
import { ValidationException } from '@codebarker/shared';

import { StartKataUseCase } from './StartKataUseCase';
import { StartKataResponse } from './StartKataResponse';
import { IStartKataRequest } from './IStartKataRequest';
import { NoAvailableKatasException } from './NoAvailableKatasException';

// #region helpers
const inputData = [
  [10, 'true'],
  ['userId', 'true'],
  [10, true],
] as any[][];

function makeKata(props?: Partial<KataProps>): Kata {
  return Kata.make({
    id: 'kataId',
    completedAt: null,
    content: 'content',
    ...props,
  });
}
// #endregion

describe('Start Kata', () => {
  let sut: StartKataUseCase;
  const repoMock = mock<IKataRepository>();

  beforeAll(() => {
    mockReset(repoMock);
    sut = new StartKataUseCase(repoMock);
  });

  test.each(inputData)(
    'throws a validation exception when the input is invalid',
    async (userId: string, excludeCompletedKatas: boolean) => {
      const request: IStartKataRequest = {
        userId,
        excludeCompletedKatas,
      };

      const act = () => sut.execute(request);

      expect(act).rejects.toThrowError(ValidationException);
    }
  );

  test.each([[true], [false]])(
    'returns a kata that has not yet been completed by the user',
    async (excludeCompletedKatas: boolean) => {
      const request: IStartKataRequest = {
        userId: 'userId',
        excludeCompletedKatas,
      };
      const completedAt = excludeCompletedKatas ? null : new Date();
      const kataId = 'kataId';
      const kata = makeKata({ id: kataId, completedAt });
      repoMock.getAsync.mockResolvedValueOnce(kata);
      const expectedResponse = StartKataResponse.from(kata);

      const response = await sut.execute(request);

      expect(repoMock.getAsync).toHaveBeenCalledWith(
        request.excludeCompletedKatas
      );

      expect(response).toEqual(expectedResponse);
    }
  );

  test('throws an exception when there is no kata available', () => {
    const request: IStartKataRequest = {
      userId: 'userId',
      excludeCompletedKatas: true,
    };
    repoMock.getAsync.mockResolvedValueOnce(null);

    const act = () => sut.execute(request);

    expect(act).rejects.toThrowError(NoAvailableKatasException);
  });
});
