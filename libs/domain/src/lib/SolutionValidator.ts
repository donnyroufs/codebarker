import { Validator } from '@codebarker/shared';

import { Smell } from './Smell';
import { SolutionProps } from './Solution';

export class SolutionValidator extends Validator<SolutionProps> {
  protected defineRules(): void {
    this.ruleFor('id', Validator.is.string);
    this.ruleFor('type', (val) => Validator.is.enum(val, Smell));
  }
}
