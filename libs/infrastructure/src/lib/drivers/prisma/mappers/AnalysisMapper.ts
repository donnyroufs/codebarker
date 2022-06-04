import { Analysis } from '@codebarker/domain';
import { cast } from '@codebarker/shared';

import { AnalysisModel } from '../models/AnalysisModel';
import { ContentMapper } from './ContentMapper';

// TODO: Create util for Json, so that I dont have to hack my way through 'any'
export class AnalysisMapper {
  public static toDomain({ content, ...rest }: AnalysisModel): Analysis {
    return Analysis.make({
      ...rest,
      sha: rest.sha === null ? undefined : rest.sha,
      content: ContentMapper.toDomain(content),
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
    };
  }
}
