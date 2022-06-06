import { AnalysisType, Vote, VoteProps } from '@codebarker/domain';

export class VoteFactory {
  public static make(props?: Partial<VoteProps>): Vote {
    return Vote.make({
      type: AnalysisType.Agree,
      userId: 'userId',
      ...props,
    });
  }
}
