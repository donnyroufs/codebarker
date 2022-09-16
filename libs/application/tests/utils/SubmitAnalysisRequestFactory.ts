import { Smell } from '@codebarker/domain';

import { ContentDto, ISubmitAnalysisRequest } from '../../src';
import { ContentFactory } from './ContentFactory';

export class SubmitAnalysisRequestFactory {
  public static make(
    props?: Partial<ISubmitAnalysisRequest>
  ): ISubmitAnalysisRequest {
    return {
      author: 'author',
      content: ContentDto.from(ContentFactory.make()),
      fileDir: 'fileDir',
      reason: 'reason',
      repositoryName: 'repositoryName',
      smell: Smell.ShotgunSurgery,
      userId: 'userId',
      sha: 'sha',
      ...props,
    };
  }
}
