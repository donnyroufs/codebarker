import { Validator } from '@codebarker/shared';

import { UserProps } from './User';
import { UserRole } from './UserRole';

export class UserValidator extends Validator<UserProps> {
  protected defineRules(): void {
    this.ruleFor('id', Validator.is.string);
    // TODO: Add email validation
    this.ruleFor('email', Validator.is.string);
    this.ruleFor('name', Validator.is.string);
    this.ruleFor('role', (val) => Validator.is.enum(val, UserRole));
  }
}
