import { User } from './User';
import { IRead } from '../IRead';

export interface IUserRepository extends IRead<User> {}

export const UserRepositoryToken = Symbol('User Repository');
