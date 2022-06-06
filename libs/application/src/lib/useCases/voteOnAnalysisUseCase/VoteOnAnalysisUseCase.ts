import { inject, injectable } from 'inversify';
import { isNull } from 'lodash';

import { IUseCase } from '@codebarker/shared';
import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
  Vote,
} from '@codebarker/domain';

import { IVoteOnAnalysisRequest } from './IVoteOnAnalysisRequest';
import { VoteOnAnalysisValidator } from './VoteOnAnalysisRequestValidator';
import { AnalysisDoesNotExistException } from './AnalysisDoesNotExistException';

@injectable()
export class VoteOnAnalysisUseCase
  implements IUseCase<IVoteOnAnalysisRequest, void>
{
  private readonly _analysisRepository: IAnalysisRepository;

  public constructor(
    @inject(AnalysisRepositoryToken) analysisRepository: IAnalysisRepository
  ) {
    this._analysisRepository = analysisRepository;
  }

  public async execute(input: IVoteOnAnalysisRequest): Promise<void> {
    this.validateOrThrow(input);

    const analysis = await this._analysisRepository.getByIdAsync(input.id);

    if (isNull(analysis)) {
      throw new AnalysisDoesNotExistException(input.id);
    }

    analysis.addVote(
      Vote.make({
        type: input.type,
        userId: input.userId,
      })
    );

    this._analysisRepository.saveAsync(analysis);
  }

  private validateOrThrow(input: IVoteOnAnalysisRequest): void {
    new VoteOnAnalysisValidator(input).validateOrThrow();
  }
}
