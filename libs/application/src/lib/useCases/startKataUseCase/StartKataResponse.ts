import { Kata } from '@codebarker/domain';
import { NullOr } from '@codebarker/shared';

export class StartKataResponse {
  public readonly id: string;
  public readonly content: string;

  private constructor(id: string, content: string) {
    this.id = id;
    this.content = content;
  }

  public static from(kata: Kata): StartKataResponse {
    return new StartKataResponse(kata.id, kata.content);
  }
}
