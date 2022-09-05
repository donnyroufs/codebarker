import { ValueObject } from '@codebarker/shared';

export type ProgrammingLanguageProps = {
  name: string;
  extension: string;
};

export class ProgrammingLanguage extends ValueObject<ProgrammingLanguageProps> {
  public get name(): string {
    return this.props.name;
  }

  public get extension(): string {
    return this.props.extension;
  }

  public static make(props: ProgrammingLanguageProps): ProgrammingLanguage {
    return new ProgrammingLanguage(props);
  }
}
