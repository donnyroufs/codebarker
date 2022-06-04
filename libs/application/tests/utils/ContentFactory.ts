import { Content, ContentProps, ProgrammingLanguage } from '@codebarker/domain';

export class ContentFactory {
  public static make(props?: Partial<ContentProps>): Content {
    return Content.make({
      lines: [],
      programmingLanguage: ProgrammingLanguage.make({
        name: 'name',
        extension: 'extension',
      }),
      ...props,
    });
  }
}
