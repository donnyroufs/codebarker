import { AnalysisType } from '@codebarker/domain';

import { IVoteOnAnalysisRequest } from '../../src';

export class VoteOnAnalysisRequestFactory {
  public static make(
    props?: Partial<IVoteOnAnalysisRequest>
  ): IVoteOnAnalysisRequest {
    return {
      id: 'id',
      type: AnalysisType.Agree,
      userId: 'userId',
      ...props,
    };
  }
}
