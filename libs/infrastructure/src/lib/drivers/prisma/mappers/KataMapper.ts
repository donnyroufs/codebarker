import { Kata } from '@codebarker/domain';

import { SolutionMapper } from './SolutionMapper';
import { AnswerMapper } from './AnswerMapper';
import { KataModel } from '../models/KataModel';

export class KataMapper {
  public static toDomain(model: KataModel): Kata {
    return Kata.make({
      id: model.id,
      content: model.content,
      answers: AnswerMapper.toDomainMany(model.answers),
      solution: SolutionMapper.toDomain(model.solution),
    });
  }

  public static toModel(entity: Kata): KataModel {
    return {
      id: entity.id,
      content: entity.content,
      solution: SolutionMapper.toModel(entity.solution),
      answers: AnswerMapper.toModelMany(entity.answers),
      solutionId: entity.solution.id,
    };
  }
}
