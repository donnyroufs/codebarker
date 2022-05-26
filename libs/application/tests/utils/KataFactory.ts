import { Kata, KataProps } from '@codebarker/domain';

export class KataFactory {
  public static make(props: Partial<KataProps>): Kata {
    return Kata.make({
      id: 'kataId',
      completedAt: null,
      content: 'content',
      solutionId: 'solutionId',
      ...props,
    });
  }
}
