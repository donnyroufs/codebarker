import { NullOrAsync } from '@codebarker/shared';

import { Kata } from './Kata';
import { ProgrammingLanguage } from './ProgrammingLanguage';

export interface IKataRepository {
  getAsync(
    userId: string,
    excludeFinishedCases?: boolean,
    previousKataId?: string
  ): NullOrAsync<Kata>;
  getByIdAsync(id: string): NullOrAsync<Kata>;
  saveAsync(kata: Kata): Promise<void>;
  getProgrammingLanguageByExtAsync(
    ext: string
  ): NullOrAsync<ProgrammingLanguage>;
  generateId(): string;
}

export const KataRepositoryToken = Symbol('IKataRepositoryToken');
