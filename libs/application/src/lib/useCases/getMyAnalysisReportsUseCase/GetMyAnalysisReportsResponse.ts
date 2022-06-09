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
    return new GetMyAnalysisReportsResponse(data);
  }
}

type Props = {
  details: AnalysisDetailsDto[];
  hasMore: boolean;
  count: number;
};
