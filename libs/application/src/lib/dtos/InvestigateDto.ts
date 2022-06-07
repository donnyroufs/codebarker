import { Smell } from '@codebarker/domain';
import { ExcludeMethods } from '@codebarker/shared';

import { ContentDto } from './ContentDto';
import { ProgrammingLanguageDto } from './ProgrammingLanguageDto';

// Not sure if this is needed yet
export class InvestigateDto {
  public readonly id: string;
  public readonly programmingLanguage: ProgrammingLanguageDto;
  public readonly smell: Smell;
  public readonly reportedBy: string;
  public readonly reason: string;
  public readonly content: ContentDto;
  public readonly upvotes: string;
  public readonly downvotes: string;
  public readonly analysisCount: number;

  private constructor(props: InvestigateDtoProps) {
    this.id = props.id;
    this.programmingLanguage = props.programmingLanguage;
    this.smell = props.smell;
    this.reportedBy = props.reportedBy;
    this.reason = props.reason;
    this.content = props.content;
    this.upvotes = props.upvotes;
    this.downvotes = props.downvotes;
    this.analysisCount = props.analysisCount;
  }

  public static make(props: InvestigateDto): InvestigateDto {
    return new InvestigateDto(props);
  }
}

type InvestigateDtoProps = ExcludeMethods<InvestigateDto>;
