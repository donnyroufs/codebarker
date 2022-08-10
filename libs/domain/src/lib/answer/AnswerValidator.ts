import { Validator } from '@codebarker/shared';

import { AnswerProps } from './Answer';
import { Smell } from '../Smell';

export class AnswerValidator extends Validator<AnswerProps> {
  protected defineRules(): void {
    this.ruleFor('id', Validator.is.string, 'the id has to be of type String');
    this.ruleFor(
      'kataId',
      Validator.is.string,
      'kataId has to be of type String'
    );
    this.ruleFor(
      'userId',
      Validator.is.string,
      'userId has to be of type String'
    );
    this.ruleFor('smell', (val) => Validator.is.enum(val, Smell));
  }
}
