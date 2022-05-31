import { Validator } from '@codebarker/shared';

import { IStartKataRequest } from './IStartKataRequest';

export class StartKataRequestValidator extends Validator<IStartKataRequest> {
  protected defineRules(): void {
    this.ruleFor(
      'excludeCompletedKatas',
      Validator.is.boolean,
      'The exclude finished cases filter has to be of type Boolean'
    );
    this.ruleFor(
      'userId',
      Validator.is.string,
      'The user id has to be of type String'
    );
    this.ruleFor(
      'previousKataId',
      (val) => Validator.is.undefined(val) || Validator.is.string(val),
      'The previous kata id has to be of type String or undefined'
    );
  }
}
