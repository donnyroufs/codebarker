import { inject, injectable } from 'inversify';

import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
} from '@codebarker/domain';
import { isNull, IUseCase } from '@codebarker/shared';

import { GetAnalysisDetailsResponse } from './GetAnalysisDetailsResponse';
import { IGetAnalysisDetailsRequest } from './IGetAnalysisDetailsRequest';
import { GetAnalysisDetailsRequestValidator } from './GetAnalysisDetailsRequestValidator';
import { AnalysisDoesNotExistException } from '../voteOnAnalysisUseCase';

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
    this.validateOrThrow(input);

    const details = await this._analysisRepository.getDetailsAsync(input.id);

    if (isNull(details)) {
      throw new AnalysisDoesNotExistException(input.id);
    }

    return GetAnalysisDetailsResponse.from(details);
  }

  private validateOrThrow(input: IGetAnalysisDetailsRequest): void {
    new GetAnalysisDetailsRequestValidator(input).validateOrThrow();
  }
}
