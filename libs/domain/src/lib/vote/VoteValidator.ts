import { Validator } from '@codebarker/shared';

import { AnalysisType } from '../analysis/AnalysisType';
import { VoteProps } from './Vote';

export class VoteValidator extends Validator<VoteProps> {
  protected defineRules(): void {
    this.ruleFor('type', (val) => Validator.is.enum(val, AnalysisType));
    this.ruleFor('userId', Validator.is.string);
  }
}
