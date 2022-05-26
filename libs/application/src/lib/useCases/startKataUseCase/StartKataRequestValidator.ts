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
  }
}
