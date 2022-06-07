import { v4 } from 'uuid';

import { Content, Line } from '@codebarker/domain';
import { cast } from '@codebarker/shared';

import { ContentModel } from '../models/ContentModel';

// TODO: Fix types
export class ContentMapper {
  public static toDomain(content: any): Content {
    return Content.make({
      lines: content.lines.map((item: any) =>
        Line.make(item.line, item.content, item.isInfected)
      ),
      programmingLanguage: content.programmingLanguage,
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
