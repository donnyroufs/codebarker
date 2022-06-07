import { AnalysisType, Vote, VoteProps } from '@codebarker/domain';

export class VoteFactory {
  public static make(props?: Partial<VoteProps>): Vote {
    return Vote.make({
      type: AnalysisType.Agree,
      userId: 'userId',
      ...props,
    });
  }
  public static makeMany(amount: number): Vote[] {
    return Array.from({ length: amount }).map((_, i) =>
      this.make({
        userId: 'userId-' + i,
        type: AnalysisType.Agree,
      })
    );
  }
}
