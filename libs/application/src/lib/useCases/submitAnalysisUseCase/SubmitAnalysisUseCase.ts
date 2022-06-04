import { inject, injectable } from 'inversify';

import { IUseCase } from '@codebarker/shared';
import {
  Analysis,
  AnalysisRepositoryToken,
  Content,
  IAnalysisRepository,
  Line,
} from '@codebarker/domain';

import { ISubmitAnalysisRequest } from './ISubmitAnalysisRequest';
import { SubmitAnalysisRequestValidator } from './SubmitAnalysisRequestValidator';

// TODO: Check if user is applicable, based on rank.
@injectable()
export class SubmitAnalysisUseCase
  implements IUseCase<ISubmitAnalysisRequest, void>
{
  private readonly _repo: IAnalysisRepository;

  public constructor(
    @inject(AnalysisRepositoryToken) analysisRepository: IAnalysisRepository
  ) {
    this._repo = analysisRepository;
  }

  public async execute(input: ISubmitAnalysisRequest): Promise<void> {
    this.validateOrThrow(input);

    const analysis = this.makeAnalysis(input);

    // TODO: Add points
    this._repo.saveAsync(analysis);
  }

  private validateOrThrow(input: ISubmitAnalysisRequest): void {
    new SubmitAnalysisRequestValidator(input).validateOrThrow();
  }

  private makeAnalysis(input: ISubmitAnalysisRequest): Analysis {
    return Analysis.make({
      author: input.author,
      content: Content.make({
        lines: input.content.lines.map((line) =>
          Line.make(line.lineNumber, line.value, line.isInfected)
        ),
      }),
      fileDir: input.fileDir,
      id: this._repo.generateId(),
      reason: input.reason,
      repositoryName: input.repositoryName,
      smell: input.smell,
      userId: input.userId,
      sha: input.sha,
    });
  }
}
