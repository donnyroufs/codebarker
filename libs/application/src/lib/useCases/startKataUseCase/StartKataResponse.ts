import { Kata } from '@codebarker/domain';
import { NullOr } from '@codebarker/shared';

export class StartKataResponse {
  public readonly id: string;
  public readonly content: string;
  public readonly completedAt: NullOr<Date>;

  private constructor(completedAt: NullOr<Date>, id: string, content: string) {
    this.completedAt = completedAt;
    this.id = id;
    this.content = content;
  }

  public static from(kata: Kata) {
    return new StartKataResponse(kata.completedAt, kata.id, kata.content);
  }
}
