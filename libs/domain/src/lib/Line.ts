import { Guard, ValueObject } from '@codebarker/shared';

type LineProps = {
  lineNumber: number;
  value: string;
  isInfected: boolean;
};

export class Line extends ValueObject<LineProps> {
  public get lineNumber(): number {
    return this.props.lineNumber;
  }

  public get value(): string {
    return this.props.value;
  }

  public get isInfected(): boolean {
    return this.props.isInfected;
  }

  public static make(props: LineProps): Line {
    Guard.Is.number<LineProps>('lineNumber', props.lineNumber);
    Guard.Is.string<LineProps>('value', props.value);
    Guard.Is.boolean<LineProps>('isInfected', props.isInfected);

    return new Line(props);
  }
}
