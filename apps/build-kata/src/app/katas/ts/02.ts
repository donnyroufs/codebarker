import { Smell } from '@codebarker/domain';

import { KataFactory } from '../../KataFactory';
import { FileReader } from '../../FileReader';
import { cwd } from 'process';

export const LargeClassTypescript02 = KataFactory.make({
  name: 'typescript',
  extension: 'ts',
  highlightedLines: [28, 147],
  solutionType: Smell.LargeClass,
  code: FileReader.readSync(
    cwd() + '/apps/build-kata/src/app/katas/ts/02.txt'
  ).toString(),
});
