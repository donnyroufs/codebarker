import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';

import {
  Content,
  Line,
  Smell,
  ProgrammingLanguage as P,
} from '@codebarker/domain';

export class KataFactory {
  public static make({
    code,
    highlightedLines,
    extension,
    name,
    solutionType,
  }: {
    code: string;
    highlightedLines: number[];
    extension: string;
    name: string;
    solutionType: Smell;
  }): Prisma.KataCreateInput {
    return {
      id: crypto.randomUUID(),
      content: {
        create: {
          id: crypto.randomUUID(),
          lines: this.makeCode(code, extension, name, highlightedLines),
          programmingLanguage: {
            connect: {
              extension_name: {
                extension,
                name,
              },
            },
          },
        },
      },
      solution: {
        create: {
          id: crypto.randomUUID(),
          type: solutionType,
        },
      },
    };
  }

  private static makeCode(
    code: string,
    extension: string,
    name: string,
    highlightedLines: number[]
  ): any {
    return Content.make({
      lines: code.split('\n').map((line, i) =>
        Line.make({
          lineNumber: i,
          value: line,
          isInfected: highlightedLines.includes(i - 1),
        })
      ),
      programmingLanguage: P.make({
        extension,
        name,
      }),
    }).lines.map((line) => ({
      line: line.lineNumber,
      content: line.value,
      isInfected: line.isInfected,
    }));
  }
}
