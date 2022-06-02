import { Analysis } from './Analysis';

export interface IAnalysisRepository {
  saveAsync(analysis: Analysis): Promise<void>;
  generateId(): string;
}

export const AnalysisRepositoryToken = Symbol('Analysis Repository');
