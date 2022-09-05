import { AnalysisType } from '@codebarker/domain';
import { Validator } from '@codebarker/shared';

import { IVoteOnAnalysisRequest } from './IVoteOnAnalysisRequest';

export class VoteOnAnalysisValidator extends Validator<IVoteOnAnalysisRequest> {
  protected defineRules(): void {
    this.ruleFor('id', Validator.is.string);
    this.ruleFor('userId', Validator.is.string);
    this.ruleFor('type', (val) => Validator.is.enum(val, AnalysisType));
  }
}
