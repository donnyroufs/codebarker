import { Guard, IEntity } from '@codebarker/shared';

import { KataId } from '../kata';
import { Smell } from '../Smell';
import { UserId } from '../user';

import { AnswerId } from './valueObjects';

export type AnswerProps = {
  id: AnswerId;
  kataId: KataId;
  userId: UserId;
  smell: Smell;
  isCorrect: boolean;
};

export class Answer implements IEntity {
  private _props: AnswerProps;

  public get id(): AnswerId {
    return this._props.id;
  }

  public get kataId(): KataId {
    return this._props.kataId;
  }

  public get userId(): UserId {
    return this._props.userId;
  }

  public get smell(): Smell {
    return this._props.smell;
  }

  public get isCorrect(): boolean {
    return this._props.isCorrect;
  }

  private constructor(props: AnswerProps) {
    this._props = props;
  }

  public static make(props: AnswerProps): Answer {
    Guard.Is.boolean<AnswerProps>('isCorrect', props.isCorrect);
    Guard.Is.enum<AnswerProps, Smell>('smell', props.smell, Smell);

    return new Answer(props);
  }
}
