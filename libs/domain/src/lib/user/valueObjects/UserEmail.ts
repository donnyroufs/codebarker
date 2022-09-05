import { Guard, ValueObject } from '@codebarker/shared';

import { UserProps } from '../User';

type UserEmailProps = {
  value: string;
};

export class UserEmail extends ValueObject<UserEmailProps> {
  public get value(): string {
    return this.props.value;
  }

  public static make(email: string): UserEmail {
    return new UserEmail({ value: Guard.Is.email<UserProps>('email', email) });
  }
}
