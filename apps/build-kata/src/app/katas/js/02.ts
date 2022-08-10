import { Smell } from '@codebarker/domain';

import { KataFactory } from '../../KataFactory';
import { FileReader } from '../../FileReader';
import { cwd } from 'process';
import { range } from 'lodash';

export const LongMethodJavascript02 = KataFactory.make({
  name: 'javascript',
  extension: 'js',
  highlightedLines: range(92, 162),
  solutionType: Smell.LongMethod,
  code: FileReader.readSync(
    cwd() + '/apps/build-kata/src/app/katas/js/02.txt'
  ).toString(),
});
