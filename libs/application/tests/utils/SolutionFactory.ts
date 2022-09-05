import { Smell, Solution, SolutionId, SolutionProps } from '@codebarker/domain';

export class SolutionFactory {
  public static make(props?: Partial<SolutionProps>): Solution {
    return Solution.make({
      id: SolutionId.make({ value: 'kataId' }),
      type: Smell.LongParameterList,
      ...props,
    });
  }
}
