import {
  Answer,
  AnswerProps,
  Content,
  ContentProps,
  IKataRepository,
  Kata,
  Line,
  ProgrammingLanguage,
  Smell,
  Solution,
  SolutionProps,
} from '@codebarker/domain';

export class KataBuilder {
  /**
   * Static userId provided by the test suite,
   * its not part of Kata.
   */
  private readonly _userId;

  private readonly _repo: IKataRepository;
  private _id: Kata['id'] = 'id';
  private _answers: Answer[] = [];
  private _content?: Content;
  private _solution?: Solution;

  public constructor(repo: IKataRepository, userId: string) {
    this._repo = repo;
    this._userId = userId;
  }

  public setId(id: Kata['id']): this {
    this._id = id;
    return this;
  }

  public withTypeScriptContent(): this {
    const line = Line.make(1, 'my first line', false);
    const lineTwo = Line.make(2, 'my second line', true);
    const content = Content.make({
      lines: [line, lineTwo],
      programmingLanguage: ProgrammingLanguage.make({
        name: 'typescript',
        extension: 'ts',
      }),
    });

    this._content = Content.make({ ...content });
    return this;
  }

  public withCSharpContent(): this {
    const line = Line.make(1, 'my first line', false);
    const lineTwo = Line.make(2, 'my second line', true);
    const content = Content.make({
      lines: [line, lineTwo],
      programmingLanguage: ProgrammingLanguage.make({
        name: 'csharp',
        extension: 'cs',
      }),
    });

    this._content = Content.make({ ...content });
    return this;
  }

  public withContent(props?: Partial<ContentProps>): KataBuilder {
    const line = Line.make(1, 'my first line', false);
    const lineTwo = Line.make(2, 'my second line', true);
    const content = Content.make({
      lines: [line, lineTwo],
      programmingLanguage: ProgrammingLanguage.make({
        name: 'typescript',
        extension: 'ts',
      }),
    });

    this._content = Content.make({ ...content, ...props });
    return this;
  }

  public withSolution(props?: Partial<SolutionProps>): this {
    this._solution = Solution.make({
      id: 'id',
      type: Smell.DataClass,
      ...props,
    });

    return this;
  }

  public asCompleted(): this {
    this._answers.push(
      Answer.make({
        id: 'completedAnswerId',
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
      id: 'answerId',
      isCorrect: false,
      kataId: this._id,
      smell: Smell.Comments,
      userId: this._userId,
    });

    this._answers.push({ ...answer, ...props });

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
    this._id = 'id';
    this._answers = [];
    this._content = undefined;
    this._solution = undefined;
  }
}
