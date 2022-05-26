import { Kata } from '@codebarker/domain';
import { NullOr } from '@codebarker/shared';

export class StartKataResponse {
  public readonly id: string;
  public readonly content: string;
  public readonly completedAt: NullOr<Date>;

  private constructor(id: string, content: string, completedAt: NullOr<Date>) {
    this.id = id;
    this.content = content;
    this.completedAt = completedAt;
  }

  public static from(kata: Kata): StartKataResponse {
    return new StartKataResponse(kata.id, kata.content, kata.completedAt);
  }
}
