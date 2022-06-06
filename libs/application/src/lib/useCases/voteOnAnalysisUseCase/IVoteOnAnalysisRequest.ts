import { AnalysisType } from '@codebarker/domain';

export interface IVoteOnAnalysisRequest {
  id: string;
  userId: string;
  type: AnalysisType;
}
