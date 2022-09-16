import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import { TestingFactory } from '@codebarker/shared';
import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
} from '@codebarker/domain';

import {
  ApplicationModule,
  GetAnalysisDetailsResponse,
  GetAnalysisDetailsUseCase,
  IGetAnalysisDetailsRequest,
  ILogger,
  LoggerToken,
  NoAvailableAnalysisForUserException,
} from '../../../src';
import { AnalysisDetailsFactory } from '../../utils';

describe('get analysis details', () => {
  const mockedRepo = mock<IAnalysisRepository>();

  let container: Container;
  let sut: GetAnalysisDetailsUseCase;

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

    sut = container.get(GetAnalysisDetailsUseCase);
  });

  test('throws an exception when the analysis is not found', () => {
    const request: IGetAnalysisDetailsRequest = {
      userId: 'userId',
      languages: ['all'],
    };

    mockedRepo.getAnalysisWithoutVotesForUserAsync.mockResolvedValueOnce(null);

    const act = (): Promise<GetAnalysisDetailsResponse> => sut.execute(request);

    expect(act).rejects.toThrowError(NoAvailableAnalysisForUserException);
  });

  test('returns analysis details', async () => {
    const request: IGetAnalysisDetailsRequest = {
      userId: 'userId',
      languages: ['all'],
    };
    const details = AnalysisDetailsFactory.make();
    const expectedResult = GetAnalysisDetailsResponse.from(details);

    mockedRepo.getAnalysisWithoutVotesForUserAsync.mockResolvedValueOnce(
      details
    );

    const result = await sut.execute(request);

    expect(result).toEqual(expectedResult);
    expect(mockedRepo.getAnalysisWithoutVotesForUserAsync).toHaveBeenCalledWith(
      request.userId,
      []
    );
  });

  test('calls the repo with the languages filter', async () => {
    const request: IGetAnalysisDetailsRequest = {
      userId: 'userId',
      languages: ['js', 'ts'],
    };
    const details = AnalysisDetailsFactory.make();

    mockedRepo.getAnalysisWithoutVotesForUserAsync.mockResolvedValueOnce(
      details
    );

    await sut.execute(request);

    expect(mockedRepo.getAnalysisWithoutVotesForUserAsync).toHaveBeenCalledWith(
      request.userId,
      request.languages
    );
  });
});
