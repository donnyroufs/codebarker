import { ExcludeMethods, IEntity, NullOr } from '@codebarker/shared';

import { Answer } from './Answer';
import { KataValidator } from './KataValidator';
import { Solution } from './Solution';

export class Kata implements IEntity {
  public readonly id: string;
  public readonly content: string;
  public readonly solution: Solution;
  public readonly answers: Answer[] = [];

  private constructor(props: KataProps) {
    this.id = props.id;
    this.content = props.content;
    this.solution = props.solution;
    this.answers = props.answers;
  }

  public isCorrectAnswer(id: string): boolean {
    return this.solution.id === id;
  }

  public addAnswer(answer: Answer): void {
    this.answers.push(answer);
  }

  public static make(props: KataProps): Kata {
    return new KataValidator(props)
      .validateOrThrow()
      .andThen(() => new Kata(props));
  }
}

export type KataProps = ExcludeMethods<Kata>;
