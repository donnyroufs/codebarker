import { Solution } from '@codebarker/domain';

import { SolutionModel } from '../models/SolutionModel';

export class SolutionMapper {
  public static toDomain(model: SolutionModel): Solution {
    return Solution.make({
      id: model.id,
      type: model.type,
    });
  }

  public static toModel(entity: Solution): SolutionModel {
    return {
      id: entity.id,
      type: entity.type,
    };
  }
}
