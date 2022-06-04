import { Line } from '@codebarker/domain';

export class LineDto {
  public readonly lineNumber: number;
  public readonly value: string;
  public readonly isInfected: boolean;

  private constructor(lineNumber: number, value: string, isInfected: boolean) {
    this.lineNumber = lineNumber;
    this.value = value;
    this.isInfected = isInfected;
  }

  public static from(line: Line): LineDto {
    return new LineDto(line.lineNumber, line.value, line.isInfected);
  }
}
