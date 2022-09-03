import {
  Analysis,
  AnalysisProps,
  AnalysisType,
  Content,
  ContentProps,
  IAnalysisRepository,
  Line,
  ProgrammingLanguage,
  Smell,
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
    const line = Line.make(1, 'my first line', false);
    const lineTwo = Line.make(2, 'my second line', true);
    const content = Content.make({
      lines: [line, lineTwo],
      programmingLanguage: ProgrammingLanguage.make({
        name: 'typescript',
        extension: 'ts',
      }),
    });

    this._props.content = Content.make({ ...content, ...props });
    return this;
  }

  public withVote(props: Partial<VoteProps> = {}): this {
    const vote = Vote.make({
      type: AnalysisType.Disagree,
      userId: this._userId,
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
      id: 'analysisId',
      author: 'author',
      fileDir: 'fileDir',
      reason: 'reason',
      content: Content.make({
        lines: [],
        programmingLanguage: ProgrammingLanguage.make({
          extension: 'ts',
          name: 'typescript',
        }),
      }),
      votes: [],
      repositoryName: 'repositoryName',
      smell: Smell.Comments,
      userId: this._userId,
      sha: 'sha',
    };
  }
}
