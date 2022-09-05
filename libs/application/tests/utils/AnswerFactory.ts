import {
  Answer,
  AnswerId,
  AnswerProps,
  KataId,
  Smell,
  UserId,
} from '@codebarker/domain';

export class AnswerFactory {
  public static make(props?: Partial<AnswerProps>): Answer {
    return Answer.make({
      id: AnswerId.make({ value: 'id' }),
      kataId: KataId.make({ value: 'kataId' }),
      userId: UserId.make({ value: 'userId' }),
      smell: Smell.DataClump,
      isCorrect: false,
      ...props,
    });
  }
}
