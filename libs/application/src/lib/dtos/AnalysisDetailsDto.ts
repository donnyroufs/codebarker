import { AnalysisDetails, AnalysisStatus, Smell } from '@codebarker/domain';

import { ContentDto } from './ContentDto';
import { ProgrammingLanguageDto } from './ProgrammingLanguageDto';
import { UserDto } from './UserDto';

type Props = {
  readonly analysisId: string;
  readonly programmingLanguage: ProgrammingLanguageDto;
  readonly smell: Smell;
  readonly reportedBy: UserDto;
  readonly reason: string;
  readonly content: ContentDto;
  readonly agreedVotesCount: number;
  readonly disagreedVotesAcount: number;
  readonly status: AnalysisStatus;
};

export class AnalysisDetailsDto {
  public readonly analysisId: string;
  public readonly programmingLanguage: ProgrammingLanguageDto;
  public readonly smell: Smell;
  public readonly reportedBy: UserDto;
  public readonly reason: string;
  public readonly content: ContentDto;
  public readonly agreedVotesCount: number;
  public readonly disagreedVotesAcount: number;
  public readonly status: AnalysisStatus;

  private constructor(props: Props) {
    this.analysisId = props.analysisId;
    this.programmingLanguage = props.programmingLanguage;
    this.agreedVotesCount = props.agreedVotesCount;
    this.disagreedVotesAcount = props.disagreedVotesAcount;
    this.content = props.content;
    this.reportedBy = props.reportedBy;
    this.reason = props.reason;
    this.smell = props.smell;
    this.status = props.status;
  }

  public static from(entity: AnalysisDetails): AnalysisDetailsDto {
    return new AnalysisDetailsDto({
      agreedVotesCount: entity.agreedVotesCount,
      analysisId: entity.analysisId,
      content: ContentDto.from(entity.content),
      disagreedVotesAcount: entity.disagreedVotesAcount,
      programmingLanguage: ProgrammingLanguageDto.make(
        entity.programmingLanguage
      ),
      reason: entity.reason,
      reportedBy: UserDto.from(entity.reportedBy),
      smell: entity.smell,
      status: entity.status,
    });
  }
}
