import { Guard, ValueObject } from '@codebarker/shared';

type AnalysisAuthorProps = {
  value: string;
};

export class AnalysisAuthor extends ValueObject<AnalysisAuthorProps> {
  public get value(): string {
    return this.props.value;
  }

  public static make(props: AnalysisAuthorProps): AnalysisAuthor {
    Guard.Is.string<AnalysisAuthorProps>('value', props.value);

    return new AnalysisAuthor(props);
  }
}
