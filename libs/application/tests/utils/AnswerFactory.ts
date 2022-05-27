import { Answer, AnswerProps } from '@codebarker/domain';

export class AnswerFactory {
  public static make(props?: Partial<AnswerProps>): Answer {
    return Answer.make({
      id: 'id',
      kataId: 'kataId',
      userId: 'userId',
      ...props,
    });
  }
}
