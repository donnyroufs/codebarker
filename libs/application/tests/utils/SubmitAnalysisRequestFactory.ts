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
      ...props,
    };
  }

  public static getBadInputData(): ISubmitAnalysisRequest[] {
    return [
      SubmitAnalysisRequestFactory.make({
        author: 1 as any,
      }),
      SubmitAnalysisRequestFactory.make({
        content: 1 as any,
      }),
      SubmitAnalysisRequestFactory.make({
        fileDir: 1 as any,
      }),
      SubmitAnalysisRequestFactory.make({
        reason: 1 as any,
      }),
      SubmitAnalysisRequestFactory.make({
        repositoryName: 1 as any,
      }),
      SubmitAnalysisRequestFactory.make({
        smell: true as any,
      }),
      SubmitAnalysisRequestFactory.make({
        userId: 1 as any,
      }),
    ];
  }
}
