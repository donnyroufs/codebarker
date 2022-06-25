import { NullOrAsync } from '@codebarker/shared';

import { User } from './User';

export interface IUserRepository {
  getByIdAsync(id: string): NullOrAsync<User>;
}

export const UserRepositoryToken = Symbol('User Repository');
