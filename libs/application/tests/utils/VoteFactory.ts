import { AnalysisType, UserId, Vote, VoteProps } from '@codebarker/domain';

export class VoteFactory {
  public static make(props?: Partial<VoteProps>): Vote {
    return Vote.make({
      type: AnalysisType.Agree,
      userId: UserId.make({ value: 'userId' }),
      ...props,
    });
  }
  public static makeMany(amount: number): Vote[] {
    return Array.from({ length: amount }).map((_, i) =>
      this.make({
        userId: UserId.make({ value: 'userId-' + i }),
        type: AnalysisType.Agree,
      })
    );
  }
}
