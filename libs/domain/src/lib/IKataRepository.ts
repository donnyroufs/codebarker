import { AsyncOption } from '@codebarker/shared';

import { Kata } from './Kata';

export interface IKataRepository {
  getAsync(excludeFinishedCases?: boolean): AsyncOption<Kata>;
  getByIdAsync(id: string): AsyncOption<Kata>;
  saveAsync(kata: Kata): Promise<void>;
}

export const KataRepositoryToken = Symbol('IKataRepositoryToken');
