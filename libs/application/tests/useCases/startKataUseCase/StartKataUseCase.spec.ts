import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import {
  IKataRepository,
  KataRepositoryToken,
  Smell,
} from '@codebarker/domain';
import { TestingFactory, ValidationException } from '@codebarker/shared';

import { ApplicationModule } from '../../../src/lib/ApplicationModule';
import {
  StartKataUseCase,
  StartKataResponse,
  IStartKataRequest,
  NoAvailableKatasException,
} from '../../../src/lib/useCases';

import { KataFactory } from '../../utils/KataFactory';
import { ILogger, LoggerToken } from '../../../src/lib/interfaces';

describe('start kata', () => {
  const mockedRepo = mock<IKataRepository>();

  let container: Container;
  let sut: StartKataUseCase;

  beforeAll(() => {
    const mockedLogger = mock<ILogger>();
    container = TestingFactory.createContainer(ApplicationModule);
    container.bind(KataRepositoryToken).toConstantValue(mockedRepo);
    container.bind(LoggerToken).toConstantValue(mockedLogger);
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
      const kataId = 'kataId';
      const kata = KataFactory.make({ id: kataId });
      mockedRepo.getAsync.mockResolvedValueOnce(kata);
      const expectedResponse = StartKataResponse.from(kata, expect.anything());

      const response = await sut.execute(request);

      expect(mockedRepo.getAsync).toHaveBeenCalledWith(
        request.userId,
        request.excludeCompletedKatas,
        undefined
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

  test('returns possible options including the answer', async () => {
    const request: IStartKataRequest = {
      userId: 'userId',
      excludeCompletedKatas: false,
    };
    const kata = KataFactory.make();
    mockedRepo.getAsync.mockResolvedValueOnce(kata);

    const response = await sut.execute(request);

    const hasInvalidSmell = response.options.some((opt) => Smell[opt] == null);
    const uniq = new Set(response.options);
    expect(hasInvalidSmell).toBeFalsy();
    expect(uniq.size).toBe(4);
    expect(response.options).toHaveLength(4);
    expect(response.options).toContain(kata.solution.type);
  });

  test('returns a different kata than before', async () => {
    const prevKataId = 'prevKataId';

    const request: IStartKataRequest = {
      userId: 'userId',
      excludeCompletedKatas: false,
      previousKataId: prevKataId,
    };

    const kataId = 'kataId';
    const kata = KataFactory.make({ id: kataId });
    mockedRepo.getAsync.mockResolvedValueOnce(kata);

    await sut.execute(request);

    expect(mockedRepo.getAsync).toHaveBeenCalledWith(
      request.userId,
      request.excludeCompletedKatas,
      request.previousKataId
    );
  });
});

function inputData(): any[] {
  return [
    [10, 'true'],
    ['userId', 'true'],
    [10, true],
    [10, false, 'previousKataId'],
  ];
}
