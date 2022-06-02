import { ValueObject } from '@codebarker/shared';

export class Line extends ValueObject {
  public readonly lineNumber: number;
  public readonly value: string;

  private constructor(lineNumber: number, value: string) {
    super();

    this.lineNumber = lineNumber;
    this.value = value;
  }

  public static make(lineNumber: number, value: string): Line {
    return new Line(lineNumber, value);
  }
}
