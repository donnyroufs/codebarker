import { Kata } from '@codebarker/domain';
import { NullOr } from '@codebarker/shared';

export class StartKataResponse {
  public readonly completedAt: NullOr<Date>;

  private constructor(completedAt: NullOr<Date>) {
    this.completedAt = completedAt;
  }

  public static from(kata: Kata) {
    return new StartKataResponse(kata.completedAt);
  }
}
