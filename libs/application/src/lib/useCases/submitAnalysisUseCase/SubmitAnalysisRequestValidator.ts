import { Smell } from '@codebarker/domain';
import { Validator } from '@codebarker/shared';
import { ContentDto } from '../../dtos';

import { ISubmitAnalysisRequest } from './ISubmitAnalysisRequest';

export class SubmitAnalysisRequestValidator extends Validator<ISubmitAnalysisRequest> {
  protected defineRules(): void {
    this.ruleFor('author', Validator.is.string);
    this.ruleFor('content', (val) => Validator.is.instance(val, ContentDto));
    this.ruleFor('fileDir', Validator.is.string);
    this.ruleFor('infectedLines', (val) => Array.isArray(val));
    this.ruleFor('reason', Validator.is.string);
    this.ruleFor('repositoryName', Validator.is.string);
    this.ruleFor('smell', (val) => Validator.is.enum(val, Smell));
    this.ruleFor('userId', Validator.is.string);
  }
}
