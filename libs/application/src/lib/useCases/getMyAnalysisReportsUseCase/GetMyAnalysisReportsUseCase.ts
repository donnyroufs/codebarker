import { inject, injectable } from 'inversify';

import { IUseCase } from '@codebarker/shared';
import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
} from '@codebarker/domain';

import { IGetMyAnalysisReportsRequest } from './IGetMyAnalysisReportsRequest';
import { GetMyAnalysisReportsResponse } from './GetMyAnalysisReportsResponse';

// TODO: Response should exclude a couple things in the future,
// we are querying data that we do not need.
@injectable()
export class GetMyAnalysisReportsUseCase
  implements
    IUseCase<IGetMyAnalysisReportsRequest, GetMyAnalysisReportsResponse>
{
  public static AMOUNT_TO_FETCH = 10;
  private readonly _analysisRepository: IAnalysisRepository;

  public constructor(
    @inject(AnalysisRepositoryToken) analysisRepository: IAnalysisRepository
  ) {
    this._analysisRepository = analysisRepository;
  }

  public async execute(
    input: IGetMyAnalysisReportsRequest
  ): Promise<GetMyAnalysisReportsResponse> {
    const data =
      await this._analysisRepository.getPaginatedAnalysisDetailsForUserAsync(
        input.userId,
        input.offset,
        input.amount ?? GetMyAnalysisReportsUseCase.AMOUNT_TO_FETCH
      );

    return GetMyAnalysisReportsResponse.from(data);
  }
}
