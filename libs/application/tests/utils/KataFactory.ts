import { Kata, KataProps } from '@codebarker/domain';
import { ContentFactory } from './ContentFactory';

import { SolutionFactory } from './SolutionFactory';

export class KataFactory {
  public static make(props?: Partial<KataProps>): Kata {
    return Kata.make({
      id: 'kataId',
      content: ContentFactory.make(),
      solution: SolutionFactory.make(),
      answers: [],
      ...props,
    });
  }
}
