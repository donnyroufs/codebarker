import { Kata } from '@codebarker/domain';

import { SolutionMapper } from './SolutionMapper';
import { AnswerMapper } from './AnswerMapper';
import { KataModel } from '../models/KataModel';
import { ContentMapper } from './ContentMapper';

// TODO: Create util so that I dont have to deal with the any type anymore
export class KataMapper {
  public static toDomain(model: KataModel): Kata {
    console.log(model);
    return Kata.make({
      id: model.id,
      content: ContentMapper.toDomain(model.content),
      answers: AnswerMapper.toDomainMany(model.answers),
      solution: SolutionMapper.toDomain(model.solution),
    });
  }

  public static toModel(entity: Kata): Omit<KataModel, 'contentId'> {
    return {
      id: entity.id,
      // TODO: Implement
      content: entity.content as any,
      solution: SolutionMapper.toModel(entity.solution),
      answers: AnswerMapper.toModelMany(entity.answers),
      solutionId: entity.solution.id,
    };
  }
}
