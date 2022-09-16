import { mock, mockReset } from 'jest-mock-extended';
import { Container } from 'inversify';

import { TestingFactory, ValidationException } from '@codebarker/shared';
import {
  AnalysisAuthor,
  AnalysisFileDir,
  AnalysisId,
  AnalysisReason,
  AnalysisRepositoryName,
  AnalysisRepositoryToken,
  AnalysisSha,
  IAnalysisRepository,
  Line,
  UserId,
} from '@codebarker/domain';

import {
  ApplicationModule,
  ILogger,
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

  test('persists the analysis and resolves', async () => {
    const id = 'generatedId';

    const request = SubmitAnalysisRequestFactory.make({
      sha: 'sha',
    });

    const analysis = AnalysisFactory.make({
      id: AnalysisId.make({ value: id }),
      author: AnalysisAuthor.make({ value: request.author }),
      fileDir: AnalysisFileDir.make({ value: request.fileDir }),
      reason: AnalysisReason.make({ value: request.reason }),
      repositoryName: AnalysisRepositoryName.make({
        value: request.repositoryName,
      }),
      sha: AnalysisSha.make({ value: request.sha! }),
      smell: request.smell,
      userId: UserId.make({ value: request.userId }),
      content: ContentFactory.make({
        lines: request.content.lines.map(Line.make),
      }),
    });

    mockedRepo.generateId.mockReturnValue(AnalysisId.make({ value: id }));
    await sut.execute(request);

    expect(mockedRepo.saveAsync).toHaveBeenCalledWith(analysis);
  });
});
