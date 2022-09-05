import {
  Analysis,
  AnalysisAuthor,
  AnalysisFileDir,
  AnalysisId,
  AnalysisProps,
  AnalysisReason,
  AnalysisRepositoryName,
  AnalysisSha,
  AnalysisType,
  Content,
  ContentProps,
  IAnalysisRepository,
  Line,
  ProgrammingLanguage,
  Smell,
  UserId,
  Vote,
  VoteProps,
} from '@codebarker/domain';

export class AnalysisBuilder {
  /**
   * Static userId provided by the test suite,
   * its not part of Kata.
   */
  private readonly _userId;
  private readonly _repo: IAnalysisRepository;

  private _props!: Partial<AnalysisProps>;

  public constructor(repo: IAnalysisRepository, userId: string) {
    this._userId = userId;
    this._repo = repo;

    this.initializeProps();
  }

  public setId(id: Analysis['id']): this {
    this._props.id = id;
    return this;
  }

  public withContent(props?: Partial<ContentProps>): this {
    const line = Line.make({
      lineNumber: 1,
      value: 'my first line',
      isInfected: false,
    });
    const lineTwo = Line.make({
      lineNumber: 2,
      value: 'my second line',
      isInfected: true,
    });
    const content = Content.make({
      lines: [line, lineTwo],
      programmingLanguage: ProgrammingLanguage.make({
        name: 'typescript',
        extension: 'ts',
      }),
    });

    this._props.content = Content.make({
      lines: content.lines,
      programmingLanguage: content.programmingLanguage,
      ...props,
    });
    return this;
  }

  public withVote(props: Partial<VoteProps> = {}): this {
    const vote = Vote.make({
      type: AnalysisType.Disagree,
      userId: UserId.make({ value: this._userId }),
      ...props,
    });

    this._props.votes?.push(vote);

    return this;
  }

  public build(): Analysis {
    return Analysis.make(this._props as AnalysisProps);
  }

  public async buildAndPersist(): Promise<Analysis> {
    const analysis = this.build();
    this.initializeProps();
    await this._repo.saveAsync(analysis);

    return analysis;
  }

  private initializeProps(): void {
    this._props = {
      id: AnalysisId.make({ value: 'analysisId'}),
      author: AnalysisAuthor.make({ value: 'author'}),
      fileDir: AnalysisFileDir.make({ value: 'fileDir'}),
      reason: AnalysisReason.make({ value: 'reason'}),
      content: Content.make({
        lines: [],
        programmingLanguage: ProgrammingLanguage.make({
          extension: 'ts',
          name: 'typescript',
        }),
      }),
      votes: [],
      repositoryName: AnalysisRepositoryName.make({ value:'repositoryName'}),
      smell: Smell.Comments,
      userId: UserId.make({ value: this._userId}),
      sha: AnalysisSha.make({ value: 'sha'}),
    };
  }
}
