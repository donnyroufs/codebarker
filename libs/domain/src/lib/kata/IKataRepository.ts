import { EntityId, NullOrAsync } from '@codebarker/shared';

import { Kata } from './Kata';
import { ProgrammingLanguage } from '../ProgrammingLanguage';
import { UserId } from '../user';
import { KataId } from './valueObjects';

export interface IKataRepository {
  getAsync(
    userId: UserId,
    excludeFinishedCases?: boolean,
    previousKataId?: KataId,
    languages?: string[]
  ): NullOrAsync<Kata>;
  getByIdAsync(id: KataId): NullOrAsync<Kata>;
  saveAsync(kata: Kata): Promise<void>;
  getProgrammingLanguagesAsync(): Promise<ProgrammingLanguage[]>;
  getProgrammingLanguageByExtAsync(
    ext: string
  ): NullOrAsync<ProgrammingLanguage>;
  countByLanguages(languages: string[]): Promise<number>;
  generateId(): EntityId;
}

export const KataRepositoryToken = Symbol('IKataRepositoryToken');
