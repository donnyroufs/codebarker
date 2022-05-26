import { Validator } from '@codebarker/shared';

import { KataProps } from './Kata';

export class KataValidator extends Validator<KataProps> {
  protected defineRules(): void {
    this.ruleFor('id', Validator.is.string);
    this.ruleFor('content', Validator.is.string);
    this.ruleFor(
      'completedAt',
      (val) => val === null || Validator.is.date(val)
    );
    this.ruleFor('solutionId', Validator.is.string);
  }
}
