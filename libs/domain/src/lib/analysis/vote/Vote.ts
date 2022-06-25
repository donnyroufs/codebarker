import { ExcludeMethods, ValueObject } from '@codebarker/shared';

import { AnalysisType } from '../AnalysisType';
import { VoteValidator } from './VoteValidator';

export class Vote extends ValueObject {
  public readonly type: AnalysisType;
  public readonly userId: string;

  private constructor(props: VoteProps) {
    super();

    this.type = props.type;
    this.userId = props.userId;
  }

  public static make(props: VoteProps): Vote {
    return new VoteValidator(props)
      .validateOrThrow()
      .andThen(() => new Vote(props));
  }
}

export type VoteProps = ExcludeMethods<Vote>;
