import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import { TestingFactory, ValidationException } from '@codebarker/shared';
import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
} from '@codebarker/domain';

import {
  AnalysisDoesNotExistException,
  ApplicationModule,
  GetAnalysisDetailsResponse,
  GetAnalysisDetailsUseCase,
  IGetAnalysisDetailsRequest,
  ILogger,
  LoggerToken,
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

  test('throws a validation exception when the input is invalid', () => {
    const request: IGetAnalysisDetailsRequest = {
      id: 1 as any,
    };

    const act = (): Promise<GetAnalysisDetailsResponse> => sut.execute(request);

    expect(act).rejects.toThrowError(ValidationException);
  });

  test('throws an exception when the analysis is not found', () => {
    const request: IGetAnalysisDetailsRequest = {
      id: 'id',
    };

    mockedRepo.getDetailsAsync.mockResolvedValueOnce(null);

    const act = (): Promise<GetAnalysisDetailsResponse> => sut.execute(request);

    expect(act).rejects.toThrowError(AnalysisDoesNotExistException);
  });

  test('returns analysis details', async () => {
    const request: IGetAnalysisDetailsRequest = {
      id: 'id',
    };
    const details = AnalysisDetailsFactory.make();
    const expectedResult = GetAnalysisDetailsResponse.from(details);

    mockedRepo.getDetailsAsync.mockResolvedValueOnce(details);

    const result = await sut.execute(request);

    expect(result).toEqual(expectedResult);
  });
});
