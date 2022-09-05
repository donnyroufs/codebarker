import {
  Answer,
  AnswerProps,
  Content,
  ContentProps,
  IKataRepository,
  Kata,
  KataId,
  Line,
  ProgrammingLanguage,
  Smell,
  Solution,
  SolutionProps,
  AnswerId,
  UserId,
  SolutionId,
} from '@codebarker/domain';

export class KataBuilder {
  /**
   * Static userId provided by the test suite,
   * its not part of Kata.
   */
  private readonly _userId;

  private readonly _repo: IKataRepository;
  private _id: KataId = KataId.make({ value: 'id' });
  private _answers: Answer[] = [];
  private _content?: Content;
  private _solution?: Solution;

  public constructor(repo: IKataRepository, userId: UserId) {
    this._repo = repo;
    this._userId = userId;
  }

  public setId(id: string): this {
    this._id = KataId.make({ value: id });
    return this;
  }

  public withTypeScriptContent(): this {
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

    this._content = Content.make({
      lines: content.lines,
      programmingLanguage: content.programmingLanguage,
    });
    return this;
  }

  public withCSharpContent(): this {
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
        name: 'csharp',
        extension: 'cs',
      }),
    });

    this._content = Content.make({
      lines: content.lines,
      programmingLanguage: content.programmingLanguage,
    });
    return this;
  }

  public withContent(props?: Partial<ContentProps>): KataBuilder {
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

    this._content = Content.make({
      lines: content.lines,
      programmingLanguage: content.programmingLanguage,
      ...props,
    });
    return this;
  }

  public withSolution(props?: Partial<SolutionProps>): this {
    this._solution = Solution.make({
      id: SolutionId.make({ value: 'id' }),
      type: Smell.DataClass,
      ...props,
    });

    return this;
  }

  public asCompleted(): this {
    this._answers.push(
      Answer.make({
        id: AnswerId.make({ value: 'completedAnswerId' }),
        isCorrect: true,
        kataId: this._id,
        smell: Smell.Comments,
        userId: this._userId,
      })
    );

    return this;
  }

  public withAnswer(props?: Partial<AnswerProps>): this {
    const answer = Answer.make({
      id: AnswerId.make({ value: 'answerId' }),
      isCorrect: false,
      kataId: this._id,
      smell: Smell.Comments,
      userId: this._userId,
      ...props,
    });

    this._answers.push(answer);

    return this;
  }

  public build(): Kata {
    if (!this._content) {
      throw new Error('missing content');
    }

    if (!this._solution) {
      throw new Error('missing solution');
    }

    const kata = Kata.make({
      id: this._id,
      answers: this._answers,
      content: this._content,
      solution: this._solution,
    });

    this.cleanup();

    return kata;
  }

  public async buildAndPersist(): Promise<Kata> {
    const kata = this.build();
    await this._repo.saveAsync(kata);

    return kata;
  }

  private cleanup(): void {
    this._id = KataId.make({ value: 'id' });
    this._answers = [];
    this._content = undefined;
    this._solution = undefined;
  }
}
