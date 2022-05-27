import { ExcludeMethods, IEntity } from '@codebarker/shared';

import { AnswerValidator } from './AnswerValidator';

export class Answer implements IEntity {
  public readonly id: string;
  public readonly kataId: string;
  public readonly userId: string;

  private constructor(props: AnswerProps) {
    this.id = props.id;
    this.kataId = props.kataId;
    this.userId = props.userId;
  }

  public static make(props: AnswerProps): Answer {
    return new AnswerValidator(props)
      .validateOrThrow()
      .andThen(() => new Answer(props));
  }
}

export type AnswerProps = ExcludeMethods<Answer>;
