import {
  User,
  UserEmail,
  UserId,
  UserName,
  UserProps,
  UserRole,
} from '@codebarker/domain';

export class UserFactory {
  public static make(props?: Partial<UserProps>): User {
    return User.make({
      email: UserEmail.make('john@test.com'),
      id: UserId.make({ value: 'id' }),
      name: UserName.make('name'),
      role: UserRole.User,
      ...props,
    });
  }
}
