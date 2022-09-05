import {
  Analysis,
  AnalysisAuthor,
  AnalysisFileDir,
  AnalysisId,
  AnalysisProps,
  AnalysisReason,
  AnalysisRepositoryName,
  AnalysisSha,
  UserId,
  Vote,
} from '@codebarker/domain';
import { cast } from '@codebarker/shared';

import { AnalysisModel } from '../models/AnalysisModel';
import { ContentMapper } from './ContentMapper';

export class AnalysisMapper {
  public static toDomain(model: AnalysisModel): Analysis {
    return Analysis.make({
      id: AnalysisId.make({ value: model.id }),
      sha:
        model.sha === null ? undefined : AnalysisSha.make({ value: model.sha }),
      content: ContentMapper.toDomain(model.content),
      votes: model.votes.map((vote) =>
        Vote.make({
          type: vote.type,
          userId: UserId.make({ value: vote.userId }),
        })
      ),
      author: AnalysisAuthor.make({ value: model.author }),
      fileDir: AnalysisFileDir.make({ value: model.fileDir }),
      reason: AnalysisReason.make({ value: model.reason }),
      repositoryName: AnalysisRepositoryName.make({
        value: model.repositoryName,
      }),
      smell: model.smell,
      userId: UserId.make({ value: model.userId }),
      status: model.status,
    });
  }

  public static toModel(
    entity: AnalysisProps
  ): Omit<AnalysisModel, 'user' | 'contentId'> {
    return {
      id: entity.id.value,
      fileDir: entity.fileDir.value,
      reason: entity.reason.value,
      repositoryName: entity.repositoryName.value,
      smell: entity.smell,
      status: entity.status!,
      userId: entity.userId.value,
      author: entity.author.value,
      sha: entity.sha === undefined ? null : entity.sha.value,
      content: cast<any>(ContentMapper.toModel(entity.content)),
      votes: entity.votes.map((vote) => ({
        type: vote.type,
        userId: vote.userId.value,
        analysisId: undefined as any, // dont need this in create args
      })),
    };
  }
}
