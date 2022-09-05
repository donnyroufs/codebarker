import { ValueObject } from '@codebarker/shared';

import { Line } from './Line';
import { ProgrammingLanguage } from './ProgrammingLanguage';

export type ContentProps = {
  lines: Line[];
  programmingLanguage: ProgrammingLanguage;
};

export class Content extends ValueObject<ContentProps> {
  public get lines(): Line[] {
    return this.props.lines;
  }

  public get programmingLanguage(): ProgrammingLanguage {
    return this.props.programmingLanguage;
  }

  public static make(props: ContentProps): Content {
    return new Content(props);
  }
}
