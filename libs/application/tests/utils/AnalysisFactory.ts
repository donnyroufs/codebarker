import {
  Analysis,
  AnalysisAuthor,
  AnalysisFileDir,
  AnalysisId,
  AnalysisProps,
  AnalysisReason,
  AnalysisRepositoryName,
  AnalysisSha,
  AnalysisStatus,
  Smell,
  UserId,
} from '@codebarker/domain';

import { ContentFactory } from './ContentFactory';

export class AnalysisFactory {
  public static make(props?: Partial<AnalysisProps>): Analysis {
    return Analysis.make({
      id: AnalysisId.make({ value: 'id' }),
      author: AnalysisAuthor.make({ value: 'author' }),
      content: ContentFactory.make(),
      fileDir: AnalysisFileDir.make({ value: 'fileDir' }),
      reason: AnalysisReason.make({ value: 'reason' }),
      repositoryName: AnalysisRepositoryName.make({ value: 'repositoryName' }),
      smell: Smell.Comments,
      userId: UserId.make({ value: 'userId' }),
      sha: AnalysisSha.make({ value: 'sha' }),
      status: AnalysisStatus.Pending,
      votes: [],
      ...props,
    });
  }
}
