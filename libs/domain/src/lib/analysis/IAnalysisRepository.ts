import { EntityId, NullOrAsync } from '@codebarker/shared';

import { Analysis } from './Analysis';
import { AnalysisDetails, PaginatedAnalysisDetails } from './AnalysisDetails';
import { AnalysisId } from './valueObjects';

export interface IAnalysisRepository {
  saveAsync(analysis: Analysis): Promise<void>;
  getByIdAsync(id: AnalysisId): NullOrAsync<Analysis>;
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
  generateId(): EntityId;
}

export const AnalysisRepositoryToken = Symbol('Analysis Repository');
