import { Analysis, AnalysisProps, Smell } from '@codebarker/domain';

import { ContentFactory } from './ContentFactory';

export class AnalysisFactory {
  public static make(props?: Partial<AnalysisProps>): Analysis {
    return Analysis.make({
      author: 'author',
      content: ContentFactory.make(),
      fileDir: 'fileDir',
      id: 'id',
      reason: 'reason',
      repositoryName: 'repositoryName',
      smell: Smell.Comments,
      userId: 'userId',
      sha: 'sha',
      ...props,
    });
  }
}
