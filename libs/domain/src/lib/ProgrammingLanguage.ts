import { ExcludeMethods, ValueObject } from '@codebarker/shared';

export class ProgrammingLanguage extends ValueObject {
  public readonly name: string;
  public readonly extension: string;

  private constructor(props: ProgrammingLanguageProps) {
    super();

    this.name = props.name;
    this.extension = props.extension;
  }

  public static make(props: ProgrammingLanguageProps): ProgrammingLanguage {
    return new ProgrammingLanguage(props);
  }
}

export type ProgrammingLanguageProps = ExcludeMethods<ProgrammingLanguage>;
