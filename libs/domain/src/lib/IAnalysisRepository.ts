import { NullOrAsync } from '@codebarker/shared';

import { Analysis } from './Analysis';
import { AnalysisDetails, PaginatedAnalysisDetails } from './AnalysisDetails';

export interface IAnalysisRepository {
  saveAsync(analysis: Analysis): Promise<void>;
  getByIdAsync(id: string): NullOrAsync<Analysis>;
  getDetailsAsync(id: string): NullOrAsync<AnalysisDetails>;
  getPaginatedAnalysisDetailsForUserAsync(
    userId: string,
    cursor: number,
    amount: number
  ): Promise<PaginatedAnalysisDetails>;
  getAnalysisWithoutVotesForUserAsync(
    userId: string,
    languages: string[]
  ): NullOrAsync<AnalysisDetails>;
  generateId(): string;
}

export const AnalysisRepositoryToken = Symbol('Analysis Repository');
