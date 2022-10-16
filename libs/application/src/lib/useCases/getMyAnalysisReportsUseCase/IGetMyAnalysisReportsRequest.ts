import { UserId } from '@codebarker/domain';

export interface IGetMyAnalysisReportsRequest {
  userId: UserId;
  offset: number;
  amount: number;
}
