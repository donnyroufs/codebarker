import { Analysis, Vote } from '@codebarker/domain';
import { cast } from '@codebarker/shared';

import { AnalysisModel } from '../models/AnalysisModel';
import { ContentMapper } from './ContentMapper';

export class AnalysisMapper {
  public static toDomain({ content, ...rest }: AnalysisModel): Analysis {
    return Analysis.make({
      ...rest,
      sha: rest.sha === null ? undefined : rest.sha,
      content: ContentMapper.toDomain(content),
      votes: rest.votes.map((vote) =>
        Vote.make({
          type: vote.type,
          userId: vote.userId,
        })
      ),
    });
  }

  public static toModel({
    content,
    ...rest
  }: Analysis): Omit<AnalysisModel, 'user' | 'contentId'> {
    return {
      ...rest,
      sha: rest.sha === undefined ? null : rest.sha,
      content: cast<any>(ContentMapper.toModel(content)),
      votes: rest.votes.map((vote) => ({
        type: vote.type,
        userId: vote.userId,
        analysisId: undefined as any, // dont need this in create args
      })),
    };
  }
}
