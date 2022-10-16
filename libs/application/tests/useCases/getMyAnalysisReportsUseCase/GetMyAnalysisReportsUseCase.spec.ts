import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import { TestingFactory } from '@codebarker/shared';


import { ApplicationModule } from '../../../src/lib/ApplicationModule';
import {
  GetMyAnalysisReportsUseCase,
  LoggerToken,
  ILogger,
  IGetMyAnalysisReportsRequest,
  GetMyAnalysisReportsResponse,
} from '../../../src';
import {
  FetchMyAnalysisReportsToken,
  IFetchMyAnalysisReports,
} from '../../../src/lib/useCases/getMyAnalysisReportsUseCase/IFetchMyAnalysisReports';
import { UserId } from '@codebarker/domain';

describe('get my analysis reports', () => {
  const mockedFetcher = mock<IFetchMyAnalysisReports>();

  let container: Container;
  let sut: GetMyAnalysisReportsUseCase;

  beforeAll(() => {
    const mockedLogger = mock<ILogger>();
    container = TestingFactory.createContainer(ApplicationModule);
    container.bind(LoggerToken).toConstantValue(mockedLogger);
    container
      .bind<IFetchMyAnalysisReports>(FetchMyAnalysisReportsToken)
      .toConstantValue(mockedFetcher);
  });

  beforeEach(() => {
    mockReset(mockedFetcher);

    sut = container.get(GetMyAnalysisReportsUseCase);
  });

  test('calls the fetcher with the request object', async () => {
    const request: IGetMyAnalysisReportsRequest = {
      amount: 5,
      offset: 0,
      userId: UserId.make({ value: 'userId' }),
    };

    await sut.execute(request);

    expect(mockedFetcher.fetch).toHaveBeenCalledWith(request);
  });

  test('returns the read model from the fetcher', async () => {
    const request: IGetMyAnalysisReportsRequest = {
      amount: 5,
      offset: 0,
      userId: UserId.make({ value: 'userId' }),
    };
    const expectedResult = GetMyAnalysisReportsResponse.from({
      count: 0,
      hasMore: false,
      reports: [],
    });
    mockedFetcher.fetch.mockResolvedValueOnce(expectedResult);

    const result = await sut.execute(request);

    expect(result).toEqual(expectedResult);
  });
});
