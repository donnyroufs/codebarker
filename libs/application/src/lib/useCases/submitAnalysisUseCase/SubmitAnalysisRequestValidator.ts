import { Content, Smell } from '@codebarker/domain';
import { Validator } from '@codebarker/shared';

import { ISubmitAnalysisRequest } from './ISubmitAnalysisRequest';

export class SubmitAnalysisRequestValidator extends Validator<ISubmitAnalysisRequest> {
  protected defineRules(): void {
    this.ruleFor('author', Validator.is.string);
    this.ruleFor('content', (val) => Array.isArray(val['lines']));
    this.ruleFor('fileDir', Validator.is.string);
    this.ruleFor('reason', Validator.is.string);
    this.ruleFor('repositoryName', Validator.is.string);
    this.ruleFor('smell', (val) => Validator.is.enum(val, Smell));
    this.ruleFor('userId', Validator.is.string);
  }
}
