import { User } from '@codebarker/domain';
import { UserModel } from '../models/UserModel';

export class UserMapper {
  public static toDomain(model: UserModel): User {
    return User.make({
      email: model.email!,
      id: model.id,
      name: model.name!,
      role: model.role,
    });
  }
}
