import { Smell } from '@codebarker/domain';

import { KataFactory } from '../../KataFactory';
import { FileReader } from '../../FileReader';
import { cwd } from 'process';

export const LongParameterTypeJavascript01 = KataFactory.make({
  name: 'javascript',
  extension: 'js',
  highlightedLines: [2, 6, 7, 8, 9, 10, 11],
  solutionType: Smell.LongParameterList,
  code: FileReader.readSync(
    cwd() + '/apps/build-kata/src/app/katas/js/01.txt'
  ).toString(),
});
