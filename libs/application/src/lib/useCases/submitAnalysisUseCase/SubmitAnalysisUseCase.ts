import { inject, injectable } from 'inversify';

import { IUseCase } from '@codebarker/shared';
import {
  Analysis,
  AnalysisAuthor,
  AnalysisFileDir,
  AnalysisReason,
  AnalysisRepositoryName,
  AnalysisRepositoryToken,
  AnalysisSha,
  Content,
  IAnalysisRepository,
  Line,
  UserId,
} from '@codebarker/domain';

import { ISubmitAnalysisRequest } from './ISubmitAnalysisRequest';
import { SubmitAnalysisRequestValidator } from './SubmitAnalysisRequestValidator';
import { ProgrammingLanguageDto } from '../../dtos';

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
    await this._repo.saveAsync(analysis);
  }

  private validateOrThrow(input: ISubmitAnalysisRequest): void {
    new SubmitAnalysisRequestValidator(input).validateOrThrow();
  }

  private makeAnalysis(input: ISubmitAnalysisRequest): Analysis {
    return Analysis.make({
      id: this._repo.generateId(),
      author: AnalysisAuthor.make({ value: input.author }),
      content: Content.make({
        lines: input.content.lines.map(Line.make),
        programmingLanguage: ProgrammingLanguageDto.toDomain(
          input.content.programmingLanguage
        ),
      }),
      fileDir: AnalysisFileDir.make({ value: input.fileDir }),
      reason: AnalysisReason.make({ value: input.reason }),
      repositoryName: AnalysisRepositoryName.make({
        value: input.repositoryName,
      }),
      smell: input.smell,
      userId: UserId.make({ value: input.userId }),
      sha: input.sha ? AnalysisSha.make({ value: input.sha }) : undefined,
      votes: [],
    });
  }
}
