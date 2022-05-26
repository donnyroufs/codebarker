import { ExcludeMethods, IEntity, NullOr } from '@codebarker/shared';

import { KataValidator } from './KataValidator';

export class Kata implements IEntity {
  public readonly id: string;
  public readonly content: string;
  public readonly completedAt: NullOr<Date>;
  public readonly solutionId: string;

  private constructor(props: KataProps) {
    this.id = props.id;
    this.completedAt = props.completedAt;
    this.content = props.content;
    this.solutionId = props.solutionId;
  }

  public isCorrectAnswer(id: string): boolean {
    return this.solutionId === id;
  }

  public static make(props: KataProps): Kata {
    return new KataValidator(props)
      .validateOrThrow()
      .map(() => new Kata(props))
      .unwrap();
  }
}

export type KataProps = ExcludeMethods<Kata>;
