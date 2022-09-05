import { PaginatedAnalysisDetails } from '@codebarker/domain';

import { AnalysisDetailsDto } from '../../dtos';

export class GetMyAnalysisReportsResponse {
  public readonly details: AnalysisDetailsDto[];
  public readonly hasMore: boolean;
  public readonly count: number;

  private constructor(props: Props) {
    this.details = props.details;
    this.hasMore = props.hasMore;
    this.count = props.count;
  }

  public static from(
    data: PaginatedAnalysisDetails
  ): GetMyAnalysisReportsResponse {
    return new GetMyAnalysisReportsResponse({
      count: data.count,
      details: data.details.map(AnalysisDetailsDto.from),
      hasMore: data.hasMore,
    });
  }
}

type Props = {
  details: AnalysisDetailsDto[];
  hasMore: boolean;
  count: number;
};
