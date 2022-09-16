import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import { TestingFactory } from '@codebarker/shared';
import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
} from '@codebarker/domain';

import { ApplicationModule } from '../../../src/lib/ApplicationModule';
import {
  AnalysisDetailsFactory,
  GetMyAnalysisReportsRequestFactory,
} from '../../utils';
import {
  GetMyAnalysisReportsUseCase,
  LoggerToken,
  ILogger,
  GetMyAnalysisReportsResponse,
} from '../../../src';

describe('get my analysis reports', () => {
  const mockedRepo = mock<IAnalysisRepository>();

  let container: Container;
  let sut: GetMyAnalysisReportsUseCase;

  beforeAll(() => {
    const mockedLogger = mock<ILogger>();
    container = TestingFactory.createContainer(ApplicationModule);
    container.bind(LoggerToken).toConstantValue(mockedLogger);
    container
      .bind<IAnalysisRepository>(AnalysisRepositoryToken)
      .toConstantValue(mockedRepo);
  });

  beforeEach(() => {
    mockReset(mockedRepo);

    sut = container.get(GetMyAnalysisReportsUseCase);
  });

  test('should return the response dto', async () => {
    const request = GetMyAnalysisReportsRequestFactory.make();
    const details = AnalysisDetailsFactory.make();
    const expectedResult = GetMyAnalysisReportsResponse.from({
      details: [details],
      hasMore: false,
      count: 0,
    });

    mockedRepo.getPaginatedAnalysisDetailsForUserAsync.mockResolvedValueOnce({
      details: [details],
      hasMore: false,
      count: 0,
    });

    const result = await sut.execute(request);

    expect(result).toEqual(expectedResult);
    expect(
      mockedRepo.getPaginatedAnalysisDetailsForUserAsync
    ).toHaveBeenCalledWith(
      request.userId,
      request.offset,
      GetMyAnalysisReportsUseCase.AMOUNT_TO_FETCH
    );
  });

  test('should use the given amount to fetch', async () => {
    const request = GetMyAnalysisReportsRequestFactory.make({ amount: 20 });
    const details = AnalysisDetailsFactory.make();

    mockedRepo.getPaginatedAnalysisDetailsForUserAsync.mockResolvedValueOnce({
      details: [details],
      hasMore: false,
      count: 0,
    });

    await sut.execute(request);

    expect(
      mockedRepo.getPaginatedAnalysisDetailsForUserAsync
    ).toHaveBeenCalledWith(request.userId, request.offset, request.amount);
  });
});
