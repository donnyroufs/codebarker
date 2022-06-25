import { ExcludeMethods, IEntity } from '@codebarker/shared';

import { Smell } from '../Smell';
import { SolutionValidator } from './SolutionValidator';

export class Solution implements IEntity {
  public readonly id: string;
  public readonly type: Smell;

  private constructor(props: SolutionProps) {
    this.id = props.id;
    this.type = props.type;
  }

  public static make(props: SolutionProps): Solution {
    return new SolutionValidator(props)
      .validateOrThrow()
      .andThen(() => new Solution(props));
  }
}

export type SolutionProps = ExcludeMethods<Solution>;
