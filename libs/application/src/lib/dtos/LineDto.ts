import { Line } from '@codebarker/domain';

export class LineDto {
  public readonly lineNumber: number;
  public readonly value: string;

  private constructor(lineNumber: number, value: string) {
    this.lineNumber = lineNumber;
    this.value = value;
  }

  public static from(line: Line): LineDto {
    return new LineDto(line.lineNumber, line.value);
  }
}
