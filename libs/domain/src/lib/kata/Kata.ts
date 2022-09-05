import { IEntity } from '@codebarker/shared';

import { Answer } from '../answer/Answer';
import { Content } from '../Content';
import { Smell } from '../Smell';
import { Solution } from '../solution/Solution';
import { KataId } from './valueObjects/KataId';

export type KataProps = {
  id: KataId;
  content: Content;
  solution: Solution;
  answers: Answer[];
};

export class Kata implements IEntity {
  private _props: KataProps;

  public get id(): KataId {
    return this._props.id;
  }

  public get content(): Content {
    return this._props.content;
  }

  public get solution(): Solution {
    return this._props.solution;
  }

  public get answers(): Answer[] {
    return this._props.answers;
  }

  private constructor(props: KataProps) {
    this._props = props;
  }

  public isCorrectAnswer(smell: Smell): boolean {
    return this._props.solution.type === smell;
  }

  public addAnswer(answer: Answer): void {
    this._props.answers.push(answer);
  }

  public static make(props: KataProps): Kata {
    return new Kata(props);
  }
}
