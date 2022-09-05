import { Guard, ValueObject } from '@codebarker/shared';

type AnalysisReasonProps = {
  value: string;
};

export class AnalysisReason extends ValueObject<AnalysisReasonProps> {
  public get value(): string {
    return this.props.value;
  }

  public static make(props: AnalysisReasonProps): AnalysisReason {
    Guard.Is.string<AnalysisReasonProps>('value', props.value);

    return new AnalysisReason(props);
  }
}
