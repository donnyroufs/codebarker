import { ExcludeMethods, ValueObject } from '@codebarker/shared';

import { Line } from './Line';
import { ProgrammingLanguage } from './ProgrammingLanguage';

export class Content extends ValueObject {
  public readonly lines: Line[] = [];
  public readonly programmingLanguage: ProgrammingLanguage;

  private constructor(props: ContentProps) {
    super();

    this.lines = props.lines;
    this.programmingLanguage = props.programmingLanguage;
  }

  public static make(props: ContentProps): Content {
    return new Content(props);
  }
}

export type ContentProps = ExcludeMethods<Content>;
