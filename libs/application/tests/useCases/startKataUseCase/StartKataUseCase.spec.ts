import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import { IKataRepository, KataRepositoryToken } from '@codebarker/domain';
import { TestingFactory, ValidationException } from '@codebarker/shared';

import { ApplicationModule } from '../../../src/lib/ApplicationModule';
import {
  StartKataUseCase,
  StartKataResponse,
  IStartKataRequest,
  NoAvailableKatasException,
} from '../../../src/lib/useCases';

import { KataFactory } from '../../utils/KataFactory';

describe('start kata', () => {
  const mockedRepo = mock<IKataRepository>();

  let container: Container;
  let sut: StartKataUseCase;

  beforeAll(() => {
    container = TestingFactory.createContainer(ApplicationModule);
    container.bind(KataRepositoryToken).toConstantValue(mockedRepo);
  });

  beforeEach(() => {
    mockReset(mockedRepo);

    sut = container.get(StartKataUseCase);
  });

  test.each(inputData())(
    'throws a validation exception when the input is invalid',
    async (userId: string, excludeCompletedKatas: boolean) => {
      const request: IStartKataRequest = {
        userId,
        excludeCompletedKatas,
      };

      const act = (): Promise<StartKataResponse> => sut.execute(request);

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
      const kata = KataFactory.make({ id: kataId, completedAt });
      mockedRepo.getAsync.mockResolvedValueOnce(kata);
      const expectedResponse = StartKataResponse.from(kata);

      const response = await sut.execute(request);

      expect(mockedRepo.getAsync).toHaveBeenCalledWith(
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

    mockedRepo.getAsync.mockResolvedValueOnce(null);

    const act = (): Promise<StartKataResponse> => sut.execute(request);

    expect(act).rejects.toThrowError(NoAvailableKatasException);
  });
});

function inputData(): any[] {
  return [
    [10, 'true'],
    ['userId', 'true'],
    [10, true],
  ];
}
