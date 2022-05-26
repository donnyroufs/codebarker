import { Validator } from '@codebarker/shared';
import { ISubmitKataRequest } from './ISubmitKataRequest';

export class SubmitKataRequestValidator extends Validator<ISubmitKataRequest> {
  protected defineRules(): void {
    this.ruleFor(
      'answerId',
      Validator.is.string,
      'The given answerId has to be of type String'
    );
    this.ruleFor(
      'kataId',
      Validator.is.string,
      'The given kataId has to be of type String'
    );
    this.ruleFor(
      'userId',
      Validator.is.string,
      'The given userId has to be of type String'
    );
  }
}
