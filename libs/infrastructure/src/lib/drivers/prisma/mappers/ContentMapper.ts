import { v4 } from 'uuid';

import { Content, Line, ProgrammingLanguage } from '@codebarker/domain';
import { cast } from '@codebarker/shared';

import { ContentModel } from '../models/ContentModel';

// TODO: Fix types
export class ContentMapper {
  public static toDomain(content: any): Content {
    return Content.make({
      lines: content.lines.map((item: any) =>
        Line.make({
          value: item.content,
          lineNumber: item.line,
          isInfected: item.isInfected,
        })
      ),
      programmingLanguage: ProgrammingLanguage.make({
        name: content.programmingLanguage.name,
        extension: content.programmingLanguage.extension,
      }),
    });
  }

  public static toModel(
    content: Content
  ): Omit<ContentModel, 'programmingLanguageId'> {
    return {
      id: v4(),
      lines: cast<string>(
        content.lines.map((line) => ({
          content: line.value,
          isInfected: line.isInfected,
          line: line.lineNumber,
        }))
      ),
      programmingLanguage: {
        name: content.programmingLanguage.name,
        extension: content.programmingLanguage.extension,
      },
      programmingLanguageExtension: content.programmingLanguage.extension,
      programmingLanguageName: content.programmingLanguage.name,
    };
  }
}
