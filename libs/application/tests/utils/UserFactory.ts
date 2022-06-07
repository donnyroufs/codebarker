import { User, UserProps, UserRole } from '@codebarker/domain';

export class UserFactory {
  public static make(props?: Partial<UserProps>): User {
    return User.make({
      email: 'john@test.com',
      id: 'id',
      name: 'name',
      role: UserRole.USER,
      ...props,
    });
  }
}
