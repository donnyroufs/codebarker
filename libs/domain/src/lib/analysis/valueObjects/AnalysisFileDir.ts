import { Guard, ValueObject } from '@codebarker/shared';

type AnalysisFileDirProps = {
  value: string;
};

export class AnalysisFileDir extends ValueObject<AnalysisFileDirProps> {
  public get value(): string {
    return this.props.value;
  }

  public static make(props: AnalysisFileDirProps): AnalysisFileDir {
    Guard.Is.string<AnalysisFileDirProps>('value', props.value);

    return new AnalysisFileDir(props);
  }
}
