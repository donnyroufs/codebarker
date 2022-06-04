import { ValueObject } from '@codebarker/shared';

export class Line extends ValueObject {
  public readonly lineNumber: number;
  public readonly value: string;
  public readonly isInfected: boolean;

  private constructor(lineNumber: number, value: string, isInfected: boolean) {
    super();

    this.lineNumber = lineNumber;
    this.value = value;
    this.isInfected = isInfected;
  }

  public static make(
    lineNumber: number,
    value: string,
    isInfected: boolean
  ): Line {
    return new Line(lineNumber, value, isInfected);
  }
}
