import { Content } from '@codebarker/domain';

import { LineDto } from './LineDto';
import { ProgrammingLanguageDto } from './ProgrammingLanguageDto';

export class ContentDto {
  public readonly lines: LineDto[];
  public readonly programmingLanguage: ProgrammingLanguageDto;

  private constructor(
    lines: LineDto[],
    programmingLanguage: ProgrammingLanguageDto
  ) {
    this.lines = lines;
    this.programmingLanguage = programmingLanguage;
  }

  public static from(props: Content): ContentDto {
    return new ContentDto(props.lines, props.programmingLanguage);
  }
}
