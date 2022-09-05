import { Answer, AnswerId, KataId, UserId } from '@codebarker/domain';

import { AnswerModel } from '../models/AnswerModel';

export class AnswerMapper {
  public static toDomain(model: AnswerModel): Answer {
    return Answer.make({
      id: AnswerId.make({ value: model.id }),
      kataId: KataId.make({ value: model.kataId }),
      userId: UserId.make({ value: model.userId }),
      smell: model.smell,
      isCorrect: model.isCorrect,
    });
  }

  public static toDomainMany(models: AnswerModel[]): Answer[] {
    return models.map(this.toDomain);
  }

  public static toModel(entity: Answer): AnswerModel {
    return {
      id: entity.id.value,
      kataId: entity.kataId.value,
      userId: entity.userId.value,
      smell: entity.smell,
      isCorrect: entity.isCorrect,
    };
  }

  public static toModelMany(entities: Answer[]): AnswerModel[] {
    return entities.map(this.toModel);
  }
}
