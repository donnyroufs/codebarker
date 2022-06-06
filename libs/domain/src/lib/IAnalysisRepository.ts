import { NullOrAsync } from '@codebarker/shared';
import { Analysis } from './Analysis';

export interface IAnalysisRepository {
  saveAsync(analysis: Analysis): Promise<void>;
  getByIdAsync(id: string): NullOrAsync<Analysis>;
  generateId(): string;
}

export const AnalysisRepositoryToken = Symbol('Analysis Repository');
