import {
  AnalysisDetails,
  AnalysisDetailsProps,
  AnalysisStatus,
  Smell,
} from '@codebarker/domain';

import { ContentFactory } from './ContentFactory';
import { ProgrammingLanguageFactory } from './ProgrammingLanguageFactory';
import { UserFactory } from './UserFactory';

export class AnalysisDetailsFactory {
  public static make(props?: Partial<AnalysisDetailsProps>): AnalysisDetails {
    return AnalysisDetails.make({
      agreedVotesCount: 0,
      analysisId: 'analysisId',
      content: ContentFactory.make(),
      disagreedVotesAcount: 0,
      programmingLanguage: ProgrammingLanguageFactory.make(),
      reason: 'reason',
      reportedBy: UserFactory.make(),
      smell: Smell.Comments,
      status: AnalysisStatus.Pending,
      ...props,
    });
  }
}
