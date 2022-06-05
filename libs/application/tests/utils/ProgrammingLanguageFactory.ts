import {
  ProgrammingLanguage,
  ProgrammingLanguageProps,
} from '@codebarker/domain';

export class ProgrammingLanguageFactory {
  public static make(
    props?: Partial<ProgrammingLanguageProps>
  ): ProgrammingLanguage {
    return ProgrammingLanguage.make({
      extension: 'extension',
      name: 'name',
      ...props,
    });
  }
}
