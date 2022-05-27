import { Kata, KataProps } from '@codebarker/domain';

import { SolutionFactory } from './SolutionFactory';

export class KataFactory {
  public static make(props?: Partial<KataProps>): Kata {
    return Kata.make({
      id: 'kataId',
      completedAt: null,
      content: 'content',
      solution: SolutionFactory.make(),
      answers: [],
      ...props,
    });
  }
}
