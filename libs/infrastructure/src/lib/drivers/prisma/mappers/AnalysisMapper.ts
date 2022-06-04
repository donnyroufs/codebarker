import { cast } from '@codebarker/shared';
import { Analysis, Content, Line } from '@codebarker/domain';

import { AnalysisModel } from '../models/AnalysisModel';

// TODO: Create util for Json, so that I dont have to hack my way through 'any'
export class AnalysisMapper {
  public static toDomain({ content, ...rest }: AnalysisModel): Analysis {
    return Analysis.make({
      ...rest,
      content: Content.make({
        lines: cast<any>(content).map((item: any) =>
          Line.make(item.line, item.content, item.isInfected)
        ),
      }),
    });
  }

  public static toModel({
    content,
    ...rest
  }: Analysis): Omit<AnalysisModel, 'user'> {
    return {
      ...rest,
      content: cast<string>(content.lines),
    };
  }
}
