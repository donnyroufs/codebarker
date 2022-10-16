type AnalysisReportDtoProps = {
  id: string;
  language: string;
  smell: string;
  percentage: number;
  agreed: number;
  disagreed: number;
  status: string;
};

export class AnalysisReportDto implements AnalysisReportDtoProps {
  public readonly id: string;
  public readonly language: string;
  public readonly smell: string;
  public readonly percentage: number;
  public readonly agreed: number;
  public readonly disagreed: number;
  public readonly status: string;

  private constructor({
    id,
    language,
    smell,
    percentage,
    agreed,
    disagreed,
    status,
  }: AnalysisReportDtoProps) {
    this.id = id;
    this.language = language;
    this.smell = smell;
    this.percentage = percentage;
    this.agreed = agreed;
    this.disagreed = disagreed;
    this.status = status;
  }

  public static make(props: AnalysisReportDtoProps): AnalysisReportDto {
    return new AnalysisReportDto(props);
  }
}
