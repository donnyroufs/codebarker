import { Solution, SolutionId } from '@codebarker/domain';

import { SolutionModel } from '../models/SolutionModel';

export class SolutionMapper {
  public static toDomain(model: SolutionModel): Solution {
    return Solution.make({
      id: SolutionId.make({ value: model.id }),
      type: model.type,
    });
  }

  public static toModel(entity: Solution): SolutionModel {
    return {
      id: entity.id.value,
      type: entity.type,
    };
  }
}
