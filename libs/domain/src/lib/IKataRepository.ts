import { AsyncNullOr } from '@codebarker/shared';

import { Kata } from './Kata';

export interface IKataRepository {
  getAsync(excludeFinishedCases?: boolean): AsyncNullOr<Kata>;
}
