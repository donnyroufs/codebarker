import { mock, mockReset } from 'jest-mock-extended';
import { Container } from 'inversify';

import { TestingFactory, ValidationException } from '@codebarker/shared';
import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
  Line,
} from '@codebarker/domain';

import {
  ApplicationModule,
  ILogger,
  ISubmitAnalysisRequest,
  LoggerToken,
  SubmitAnalysisUseCase,
} from '../../../src';
import { AnalysisFactory, SubmitAnalysisRequestFactory } from '../../utils';
import { ContentFactory } from '../../utils/ContentFactory';

describe('submit analysis', () => {
  const mockedRepo = mock<IAnalysisRepository>();

  let container: Container;
  let sut: SubmitAnalysisUseCase;

  beforeAll(() => {
    const mockedLogger = mock<ILogger>();
    container = TestingFactory.createContainer(ApplicationModule);
    container.bind(LoggerToken).toConstantValue(mockedLogger);
    container.bind(AnalysisRepositoryToken).toConstantValue(mockedRepo);
  });

  beforeEach(() => {
    mockReset(mockedRepo);
    sut = container.get(SubmitAnalysisUseCase);
  });

  test.each(SubmitAnalysisRequestFactory.getBadInputData())(
    'throws a validation exception when the input is invalids defined',
    (request: ISubmitAnalysisRequest) => {
      const act = (): Promise<void> => sut.execute(request);

      expect(act).rejects.toThrowError(ValidationException);
    }
  );

  test('persists the analysis and resolves', async () => {
    const id = 'generatedId';

    const request = SubmitAnalysisRequestFactory.make();
    const { content, ...rest } = request;
    const analysis = AnalysisFactory.make({
      ...rest,
      id,
      content: ContentFactory.make({
        lines: content.lines.map((line) =>
          Line.make(line.lineNumber, line.value, line.isInfected)
        ),
      }),
    });

    mockedRepo.generateId.mockReturnValue(id);
    await sut.execute(request);

    expect(mockedRepo.saveAsync).toHaveBeenCalledWith(analysis);
  });
});
