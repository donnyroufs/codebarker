import { ExcludeMethods, IEntity } from '@codebarker/shared';

import { Answer } from '../answer/Answer';
import { Content } from '../Content';
import { KataValidator } from './KataValidator';
import { Smell } from '../Smell';
import { Solution } from '../solution/Solution';

export class Kata implements IEntity {
  public readonly id: string;
  public readonly content: Content;
  public readonly solution: Solution;
  public readonly answers: Answer[] = [];

  private constructor(props: KataProps) {
    this.id = props.id;
    this.content = props.content;
    this.solution = props.solution;
    this.answers = props.answers;
  }

  public isCorrectAnswer(smell: Smell): boolean {
    return this.solution.type === smell;
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
