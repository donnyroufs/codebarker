import { Guard, ValueObject } from '@codebarker/shared';

type AnalysisShaProps = {
  value: string;
};

export class AnalysisSha extends ValueObject<AnalysisShaProps> {
  public get value(): string {
    return this.props.value;
  }

  public static make(props: AnalysisShaProps): AnalysisSha {
    Guard.Is.string<AnalysisShaProps>('value', props.value);

    return new AnalysisSha(props);
  }
}
