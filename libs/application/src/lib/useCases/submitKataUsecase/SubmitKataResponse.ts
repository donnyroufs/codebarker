export class SubmitKataResponse {
  public readonly isCorrect: boolean;

  private constructor(isCorrect: boolean) {
    this.isCorrect = isCorrect;
  }

  public static from(isCorrect: boolean): SubmitKataResponse {
    return new SubmitKataResponse(isCorrect);
  }
}
