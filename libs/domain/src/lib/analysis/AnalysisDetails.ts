import { ValueObject } from '@codebarker/shared';
import { AnalysisDetailsValidator } from './AnalysisDetailsValidator';
import { AnalysisStatus } from './AnalysisStatus';

import { Content } from '../Content';
import { IPaginate } from '../IPaginate';
import { ProgrammingLanguage } from '../ProgrammingLanguage';
import { Smell } from '../Smell';
import { User } from '../user/User';

export type AnalysisDetailsProps = {
  readonly analysisId: string;
  readonly programmingLanguage: ProgrammingLanguage;
  readonly smell: Smell;
  readonly reportedBy: User;
  readonly reason: string;
  readonly content: Content;
  readonly agreedVotesCount: number;
  readonly disagreedVotesAcount: number;
  readonly status: AnalysisStatus;
};

// - analysis count that user has not voted on?
export class AnalysisDetails extends ValueObject {
  public readonly analysisId: string;
  public readonly programmingLanguage: ProgrammingLanguage;
  public readonly smell: Smell;
  public readonly reportedBy: User;
  public readonly reason: string;
  public readonly content: Content;
  public readonly agreedVotesCount: number;
  public readonly disagreedVotesAcount: number;
  public readonly status: AnalysisStatus;

  private constructor(props: AnalysisDetailsProps) {
    super();

    this.analysisId = props.analysisId;
    this.programmingLanguage = props.programmingLanguage;
    this.smell = props.smell;
    this.reportedBy = props.reportedBy;
    this.reason = props.reason;
    this.content = props.content;
    this.agreedVotesCount = props.agreedVotesCount;
    this.disagreedVotesAcount = props.disagreedVotesAcount;
    this.status = props.status;
  }

  public static make(props: AnalysisDetailsProps): AnalysisDetails {
    return new AnalysisDetailsValidator(props)
      .validateOrThrow()
      .andThen(() => new AnalysisDetails(props));
  }
}

export type PaginatedAnalysisDetails = IPaginate & {
  details: AnalysisDetails[];
};
