import { Kata, Smell } from '@codebarker/domain';

import { ContentDto } from '../../dtos/ContentDto';

export class StartKataResponse {
  public readonly id: string;
  public readonly content: ContentDto;
  public readonly options: Smell[];

  private constructor(id: string, content: ContentDto, options: Smell[]) {
    this.id = id;
    this.content = content;
    this.options = options;
  }

  public static from(kata: Kata, options: Smell[]): StartKataResponse {
    return new StartKataResponse(
      kata.id.value,
      ContentDto.from(kata.content),
      options
    );
  }
}
