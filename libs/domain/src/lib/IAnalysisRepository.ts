import { NullOrAsync } from '@codebarker/shared';

import { Analysis } from './Analysis';
import { AnalysisDetails } from './AnalysisDetails';

export interface IAnalysisRepository {
  saveAsync(analysis: Analysis): Promise<void>;
  getByIdAsync(id: string): NullOrAsync<Analysis>;
  getDetailsAsync(id: string): NullOrAsync<AnalysisDetails>;
  generateId(): string;
}

export const AnalysisRepositoryToken = Symbol('Analysis Repository');
