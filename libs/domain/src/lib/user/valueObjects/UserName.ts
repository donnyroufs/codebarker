import { Guard, ValueObject } from '@codebarker/shared';

import { UserProps } from '../User';

type UserNameProps = {
  value: string;
};

export class UserName extends ValueObject<UserNameProps> {
  public get value(): string {
    return this.props.value;
  }

  public static make(userName: string): UserName {
    return new UserName({
      value: Guard.Against.nullOrWhiteSpace<UserProps>('name', userName),
    });
  }
}
