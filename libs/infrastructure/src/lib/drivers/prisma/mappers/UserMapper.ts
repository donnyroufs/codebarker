import { User, UserEmail, UserId, UserName } from '@codebarker/domain';

import { UserModel } from '../models/UserModel';

export class UserMapper {
  public static toDomain(model: UserModel): User {
    return User.make({
      id: UserId.make({ value: model.id! }),
      email: UserEmail.make(model.email!),
      name: UserName.make(model.name!),
      role: model.role,
    });
  }
}
