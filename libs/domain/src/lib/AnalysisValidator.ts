import { Validator } from '@codebarker/shared';
import { AnalysisProps } from './Analysis';
import { Content } from './Content';
import { Smell } from './Smell';

export class AnalysisValidator extends Validator<AnalysisProps> {
  protected defineRules(): void {
    this.ruleFor('author', Validator.is.string);
    this.ruleFor('content', (val) => Validator.is.instance(val, Content));
    this.ruleFor('fileDir', Validator.is.string);
    this.ruleFor('reason', Validator.is.string);
    this.ruleFor('repositoryName', Validator.is.string);
    this.ruleFor('smell', (val) => Validator.is.enum(val, Smell));
    this.ruleFor('userId', Validator.is.string);
  }
}
