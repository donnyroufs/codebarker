import { IEntity } from '@codebarker/shared';
import { UserRole } from './enums';
import { UserId, UserName, UserEmail } from './valueObjects';

export type UserProps = {
  id: UserId;
  name: UserName;
  email: UserEmail;
  role: UserRole;
};

export class User implements IEntity {
  private readonly _props: UserProps;

  public get id(): UserId {
    return this._props.id;
  }

  public get name(): UserName {
    return this._props.name;
  }

  public get email(): UserEmail {
    return this._props.email;
  }

  public get role(): UserRole {
    return this._props.role;
  }

  private constructor(props: UserProps) {
    this._props = props;
  }

  public static make(props: UserProps): User {
    return new User(props);
  }
}
