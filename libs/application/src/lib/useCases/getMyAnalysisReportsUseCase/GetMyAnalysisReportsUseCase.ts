import { inject, injectable } from 'inversify';

import { IUseCase } from '@codebarker/shared';

import { IGetMyAnalysisReportsRequest } from './IGetMyAnalysisReportsRequest';
import { GetMyAnalysisReportsResponse } from './GetMyAnalysisReportsResponse';
import {
  FetchMyAnalysisReportsToken,
  IFetchMyAnalysisReports,
} from './IFetchMyAnalysisReports';

@injectable()
export class GetMyAnalysisReportsUseCase
  implements
    IUseCase<IGetMyAnalysisReportsRequest, GetMyAnalysisReportsResponse>
{
  public static AMOUNT_TO_FETCH = 10;
  private readonly _fetchMyAnalysisReports: IFetchMyAnalysisReports;

  public constructor(
    @inject(FetchMyAnalysisReportsToken) fetcher: IFetchMyAnalysisReports
  ) {
    this._fetchMyAnalysisReports = fetcher;
  }

  public execute = (
    input: IGetMyAnalysisReportsRequest
  ): Promise<GetMyAnalysisReportsResponse> =>
    this._fetchMyAnalysisReports.fetch(input);
}
