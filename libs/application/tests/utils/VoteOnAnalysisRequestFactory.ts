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

  public static makeBadInput(): IVoteOnAnalysisRequest[] {
    return [
      this.make({
        id: 1 as any,
      }),
      this.make({ type: 9999 }),
      this.make({ userId: 1 as any }),
    ];
  }
}
