import { Smell } from '@codebarker/domain';

import { KataFactory } from '../../KataFactory';
import { FileReader } from '../../FileReader';
import { cwd } from 'process';

export const LongParameterTypeScript01 = KataFactory.make({
  name: 'typescript',
  extension: 'ts',
  highlightedLines: [12, 13, 14, 15, 16, 20, 21, 22],
  solutionType: Smell.LongParameterList,
  code: FileReader.readSync(
    cwd() + '/apps/build-kata/src/app/katas/ts/01.txt'
  ).toString(),
});
