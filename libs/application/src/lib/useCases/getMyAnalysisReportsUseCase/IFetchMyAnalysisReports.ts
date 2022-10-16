import { IFetcher } from '@codebarker/shared';
import { GetMyAnalysisReportsResponse, IGetMyAnalysisReportsRequest } from '..';

export interface IFetchMyAnalysisReports
  extends IFetcher<
    IGetMyAnalysisReportsRequest,
    GetMyAnalysisReportsResponse
  > {}

export const FetchMyAnalysisReportsToken = Symbol('FetchMyAnalysisReports');
