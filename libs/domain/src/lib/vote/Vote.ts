import { ValueObject } from '@codebarker/shared';

import { AnalysisType } from '../analysis/AnalysisType';
import { UserId } from '../user';

export type VoteProps = {
  type: AnalysisType;
  userId: UserId;
};

export class Vote extends ValueObject<VoteProps> {
  public get type(): AnalysisType {
    return this.props.type;
  }

  public get userId(): UserId {
    return this.props.userId;
  }

  public static make(props: VoteProps): Vote {
    return new Vote(props);
  }
}
