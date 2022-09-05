import { Validator } from '@codebarker/shared';

import { IStartKataRequest } from './IStartKataRequest';

export class StartKataRequestValidator extends Validator<IStartKataRequest> {
  protected defineRules(): void {}
}


/*

interface IValidator<Props extends Record<string, unknown>> {
  [key: string]: ...
}

export interface IStartKataRequestValidator implements IValidator<IStartKataRequest> { }

// in infra
class StartKataRequestValidator implements IStartKataRequestValidator {
  public rulesForUserId() { }
  ...
}




*/