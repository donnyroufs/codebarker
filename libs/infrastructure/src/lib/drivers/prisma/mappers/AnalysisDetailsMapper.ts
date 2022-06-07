import { AnalysisDetails, AnalysisType } from '@codebarker/domain';

import { AnalysisModel } from '../models/AnalysisModel';
import { ContentMapper } from './ContentMapper';
import { UserMapper } from './UserMapper';

export class AnalysisDetailsMapper {
  public static toDomain(model: AnalysisModel): AnalysisDetails {
    const totalVotes = model.votes.length;
    const agreedVotesCount = model.votes.filter(
      (vote) => vote.type === AnalysisType.Agree
    ).length;
    const content = ContentMapper.toDomain(model.content);

    return AnalysisDetails.make({
      agreedVotesCount: agreedVotesCount,
      analysisId: model.id,
      content,
      disagreedVotesAcount: Math.abs(totalVotes - agreedVotesCount),
      programmingLanguage: content.programmingLanguage,
      reason: model.reason,
      reportedBy: UserMapper.toDomain(model.user),
      smell: model.smell,
      status: model.status,
    });
  }
}
