import { Smell, Solution, SolutionProps } from '@codebarker/domain';

export class SolutionFactory {
  public static make(props?: Partial<SolutionProps>): Solution {
    return Solution.make({
      id: 'kataId',
      type: Smell.LongParameterList,
      ...props,
    });
  }
}
