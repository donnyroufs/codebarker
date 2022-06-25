import { NullOrAsync } from '@codebarker/shared';

import { Kata } from './Kata';
import { ProgrammingLanguage } from '../ProgrammingLanguage';

export interface IKataRepository {
  getAsync(
    userId: string,
    excludeFinishedCases?: boolean,
    previousKataId?: string,
    languages?: string[]
  ): NullOrAsync<Kata>;
  getByIdAsync(id: string): NullOrAsync<Kata>;
  saveAsync(kata: Kata): Promise<void>;
  getProgrammingLanguagesAsync(): Promise<ProgrammingLanguage[]>;
  getProgrammingLanguageByExtAsync(
    ext: string
  ): NullOrAsync<ProgrammingLanguage>;
  countByLanguages(languages: string[]): Promise<number>;
  generateId(): string;
}

export const KataRepositoryToken = Symbol('IKataRepositoryToken');
