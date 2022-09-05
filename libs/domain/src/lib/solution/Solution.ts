import { Guard, IEntity } from '@codebarker/shared';

import { Smell } from '../Smell';
import { SolutionId } from './valueObjects';

export type SolutionProps = {
  id: SolutionId;
  type: Smell;
};

export class Solution implements IEntity {
  private _props: SolutionProps;

  public get id(): SolutionId {
    return this._props.id;
  }

  public get type(): Smell {
    return this._props.type;
  }

  private constructor(props: SolutionProps) {
    this._props = props;
  }

  public static make(props: SolutionProps): Solution {
    Guard.Is.enum<SolutionProps, Smell>('type', props.type, Smell);

    return new Solution(props);
  }
}
