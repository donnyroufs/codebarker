import { Validator } from '@codebarker/shared';
import { IGetAnalysisDetailsRequest } from '..';

export class GetAnalysisDetailsRequestValidator extends Validator<IGetAnalysisDetailsRequest> {
  protected defineRules(): void {
    this.ruleFor('id', Validator.is.string);
  }
}
