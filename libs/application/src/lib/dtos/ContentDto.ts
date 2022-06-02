import { Content } from '@codebarker/domain';

import { LineDto } from './LineDto';

export class ContentDto {
  public readonly lines: LineDto[];

  private constructor(lines: LineDto[]) {
    this.lines = lines;
  }

  public static from(props: Content): ContentDto {
    return new ContentDto(props.lines);
  }
}
