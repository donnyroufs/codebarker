import { Guard, ValueObject } from '@codebarker/shared';

type AnalysisRepositoryNameProps = {
  value: string;
};

export class AnalysisRepositoryName extends ValueObject<AnalysisRepositoryNameProps> {
  public get value(): string {
    return this.props.value;
  }

  public static make(
    props: AnalysisRepositoryNameProps
  ): AnalysisRepositoryName {
    Guard.Is.string<AnalysisRepositoryNameProps>('value', props.value);

    return new AnalysisRepositoryName(props);
  }
}
