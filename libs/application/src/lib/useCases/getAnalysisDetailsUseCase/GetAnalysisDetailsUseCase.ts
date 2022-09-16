import { inject, injectable } from 'inversify';

import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
} from '@codebarker/domain';
import { isNull, IUseCase } from '@codebarker/shared';

import { GetAnalysisDetailsResponse } from './GetAnalysisDetailsResponse';
import { IGetAnalysisDetailsRequest } from './IGetAnalysisDetailsRequest';
import { NoAvailableAnalysisForUserException } from './NoAvailableAnalysisForUserException';

@injectable()
export class GetAnalysisDetailsUseCase
  implements IUseCase<IGetAnalysisDetailsRequest, GetAnalysisDetailsResponse>
{
  private readonly _analysisRepository: IAnalysisRepository;

  public constructor(
    @inject(AnalysisRepositoryToken) analysisRepository: IAnalysisRepository
  ) {
    this._analysisRepository = analysisRepository;
  }

  public async execute(
    input: IGetAnalysisDetailsRequest
  ): Promise<GetAnalysisDetailsResponse> {
    const langs = input.languages.at(0) === 'all' ? [] : input.languages;

    const details =
      await this._analysisRepository.getAnalysisWithoutVotesForUserAsync(
        input.userId,
        langs
      );

    if (isNull(details)) {
      throw new NoAvailableAnalysisForUserException();
    }

    return GetAnalysisDetailsResponse.from(details);
  }
}
