import { Content, Kata, Line } from '@codebarker/domain';

import { SolutionMapper } from './SolutionMapper';
import { AnswerMapper } from './AnswerMapper';
import { KataModel } from '../models/KataModel';

export class KataMapper {
  public static toDomain(model: KataModel): Kata {
    return Kata.make({
      id: model.id,
      content: Content.make({
        lines: (model.content as any).map((item: any) =>
          Line.make(item.line, item.content)
        ),
      }),
      answers: AnswerMapper.toDomainMany(model.answers),
      solution: SolutionMapper.toDomain(model.solution),
    });
  }

  public static toModel(entity: Kata): KataModel {
    return {
      id: entity.id,
      content: JSON.stringify(entity.content.lines),
      solution: SolutionMapper.toModel(entity.solution),
      answers: AnswerMapper.toModelMany(entity.answers),
      solutionId: entity.solution.id,
    };
  }
}
