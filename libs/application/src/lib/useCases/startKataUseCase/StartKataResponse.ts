import { Kata, Smell } from '@codebarker/domain';

export class StartKataResponse {
  public readonly id: string;
  public readonly content: string;
  public readonly options: Smell[];

  private constructor(id: string, content: string, options: Smell[]) {
    this.id = id;
    this.content = content;
    this.options = options;
  }

  public static from(kata: Kata, options: Smell[]): StartKataResponse {
    return new StartKataResponse(kata.id, kata.content, options);
  }
}
