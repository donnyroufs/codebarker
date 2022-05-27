import { NullOrAsync } from '@codebarker/shared';

import { Kata } from './Kata';

export interface IKataRepository {
  getAsync(excludeFinishedCases?: boolean): NullOrAsync<Kata>;
  getByIdAsync(id: string): NullOrAsync<Kata>;
  saveAsync(kata: Kata): Promise<void>;
  generateId(): string;
}

export const KataRepositoryToken = Symbol('IKataRepositoryToken');
