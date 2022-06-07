import { Validator } from '@codebarker/shared';
import { IGetAnalysisDetailsRequest } from '..';

export class GetAnalysisDetailsRequestValidator extends Validator<IGetAnalysisDetailsRequest> {
  protected defineRules(): void {
    this.ruleFor('userId', Validator.is.string);
    this.ruleFor('languages', (val) => val.every(Validator.is.string));
  }
}
