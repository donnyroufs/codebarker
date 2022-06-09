import { Validator } from '@codebarker/shared';

import { IGetMyAnalysisReportsRequest } from './IGetMyAnalysisReportsRequest';

export class GetMyAnalysisReportsRequestValidator extends Validator<IGetMyAnalysisReportsRequest> {
  protected defineRules(): void {
    this.ruleFor('offset', Validator.is.number);
    this.ruleFor('userId', Validator.is.string);
  }
}
