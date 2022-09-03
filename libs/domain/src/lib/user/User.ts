import { BaseEntity } from '@codebarker/shared';

import { UserRole } from './UserRole';
import { UserValidator } from './UserValidator';

export type UserProps = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export class User extends BaseEntity<UserProps> {
  public readonly name: string;
  public readonly email: string;
  public readonly role: UserRole;

  private constructor(props: UserProps) {
    super(props);

    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
  }

  public static make(props: UserProps): User {
    return new UserValidator(props)
      .validateOrThrow()
      .andThen(() => new User(props));
  }
}
