import { ExcludeMethods, ValueObject } from '@codebarker/shared';

import { Line } from './Line';

export class Content extends ValueObject {
  public readonly lines: Line[] = [];

  private constructor(lines: Line[]) {
    super();

    this.lines = lines;
  }

  public static make(props: ContentProps): Content {
    return new Content(props.lines);
  }
}

export type ContentProps = ExcludeMethods<Content>;
