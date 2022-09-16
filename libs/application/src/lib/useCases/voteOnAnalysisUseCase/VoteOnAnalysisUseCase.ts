import { inject, injectable } from 'inversify';
import { isNull } from 'lodash';

import { IUseCase } from '@codebarker/shared';
import {
  Analysis,
  AnalysisId,
  AnalysisRepositoryToken,
  AnalysisStatus,
  IAnalysisRepository,
  IKataRepository,
  Kata,
  KataRepositoryToken,
  Solution,
  UserId,
  Vote,
} from '@codebarker/domain';

import { IVoteOnAnalysisRequest } from './IVoteOnAnalysisRequest';
import { AnalysisDoesNotExistException } from './AnalysisDoesNotExistException';

@injectable()
export class VoteOnAnalysisUseCase
  implements IUseCase<IVoteOnAnalysisRequest, void>
{
  private readonly _analysisRepository: IAnalysisRepository;
  private readonly _kataRepository: IKataRepository;

  public constructor(
    @inject(AnalysisRepositoryToken) analysisRepository: IAnalysisRepository,
    @inject(KataRepositoryToken) kataRepository: IKataRepository
  ) {
    this._analysisRepository = analysisRepository;
    this._kataRepository = kataRepository;
  }

  public async execute(input: IVoteOnAnalysisRequest): Promise<void> {
    const id = AnalysisId.make({ value: input.id });

    const analysis = await this._analysisRepository.getByIdAsync(id);

    if (isNull(analysis)) {
      throw new AnalysisDoesNotExistException(id.value);
    }

    analysis.addVote(
      Vote.make({
        type: input.type,
        userId: UserId.make({ value: input.userId }),
      })
    );

    await this._analysisRepository.saveAsync(analysis);

    this.makeOfficialKataWhenAccepted(analysis);
  }

  // TODO: Refactor this by subscribing to an event
  private makeOfficialKataWhenAccepted(analysis: Analysis): void {
    if (analysis.status !== AnalysisStatus.Accepted) return;

    const kata = Kata.make({
      id: this._kataRepository.generateId(),
      answers: [],
      content: analysis.content,
      solution: Solution.make({
        id: this._kataRepository.generateId(),
        type: analysis.smell,
      }),
    });

    this._kataRepository.saveAsync(kata);
  }
}
