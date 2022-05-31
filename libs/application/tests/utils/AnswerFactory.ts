import { Answer, AnswerProps, Smell } from '@codebarker/domain';

export class AnswerFactory {
  public static make(props?: Partial<AnswerProps>): Answer {
    return Answer.make({
      id: 'id',
      kataId: 'kataId',
      userId: 'userId',
      smell: Smell.DataClump,
      isCorrect: false,
      ...props,
    });
  }
}
