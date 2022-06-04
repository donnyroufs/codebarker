import { Content, Kata, Line } from '@codebarker/domain';

import { SolutionMapper } from './SolutionMapper';
import { AnswerMapper } from './AnswerMapper';
import { KataModel } from '../models/KataModel';
import { cast } from '@codebarker/shared';

// TODO: Create util so that I dont have to deal with the any type anymore
export class KataMapper {
  public static toDomain(model: KataModel): Kata {
    return Kata.make({
      id: model.id,
      content: Content.make({
        lines: cast<any>(model.content).map((item: any) =>
          Line.make(item.line, item.content, item.isInfected)
        ),
      }),
      answers: AnswerMapper.toDomainMany(model.answers),
      solution: SolutionMapper.toDomain(model.solution),
    });
  }

  public static toModel(entity: Kata): KataModel {
    return {
      id: entity.id,
      // TODO: Might need to get rid of JSOn.stringify here
      content: JSON.stringify(entity.content.lines),
      solution: SolutionMapper.toModel(entity.solution),
      answers: AnswerMapper.toModelMany(entity.answers),
      solutionId: entity.solution.id,
    };
  }
}
