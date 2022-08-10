import { Smell } from '@codebarker/domain';

import { KataFactory } from '../../KataFactory';
import { FileReader } from '../../FileReader';
import { cwd } from 'process';

export const CommentsTypescript01 = KataFactory.make({
  name: 'typescript',
  extension: 'ts',
  highlightedLines: [12, 16, 38],
  solutionType: Smell.Comments,
  code: FileReader.readSync(
    cwd() + '/apps/build-kata/src/app/katas/ts/01.txt'
  ).toString(),
});
