import { Kata, KataId } from '@codebarker/domain';

import { SolutionMapper } from './SolutionMapper';
import { AnswerMapper } from './AnswerMapper';
import { KataModel } from '../models/KataModel';
import { ContentMapper } from './ContentMapper';

export class KataMapper {
  public static toDomain(model: KataModel): Kata {
    return Kata.make({
      id: KataId.make({ value: model.id }),
      content: ContentMapper.toDomain(model.content),
      answers: AnswerMapper.toDomainMany(model.answers),
      solution: SolutionMapper.toDomain(model.solution),
    });
  }

  public static toModel(entity: Kata): Omit<KataModel, 'contentId'> {
    return {
      id: entity.id.value,
      content: ContentMapper.toModel(entity.content),
      solution: SolutionMapper.toModel(entity.solution),
      answers: AnswerMapper.toModelMany(entity.answers),
      solutionId: entity.solution.id.value,
    };
  }
}
