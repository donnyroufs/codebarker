import {  AnalysisReportDto } from '../../dtos';

type Props = {
  reports: AnalysisReportDto[];
  hasMore: boolean;
  count: number;
};

export class GetMyAnalysisReportsResponse {
  public readonly reports: AnalysisReportDto[];
  public readonly hasMore: boolean;
  public readonly count: number;

  private constructor(props: Props) {
    this.reports = props.reports;
    this.hasMore = props.hasMore;
    this.count = props.count;
  }

  public static from(
    data: GetMyAnalysisReportsResponse
  ): GetMyAnalysisReportsResponse {
    return new GetMyAnalysisReportsResponse({
      count: data.count,
      reports: data.reports,
      hasMore: data.hasMore,
    });
  }
}
