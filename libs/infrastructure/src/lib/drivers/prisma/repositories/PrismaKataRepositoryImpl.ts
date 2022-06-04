import { v4 } from 'uuid';
import { injectable, inject } from 'inversify';

import { IKataRepository, Kata } from '@codebarker/domain';
import { ILogger, LoggerToken } from '@codebarker/application';
import { cast, isNull, NullOrAsync } from '@codebarker/shared';

import { PrismaService } from '../PrismaService';
import { KataMapper } from '../mappers/KataMapper';

@injectable()
export class PrismaKataRepositoryImpl implements IKataRepository {
  private readonly _prismaService: PrismaService;
  private readonly _logger: ILogger;

  public constructor(
    prismaService: PrismaService,
    @inject(LoggerToken) logger: ILogger
  ) {
    this._prismaService = prismaService;
    this._logger = logger;
  }

  // TODO: Abstract filters
  // TODO: Write an integration test against the filters
  // - Random kata
  // does it exclude the previous one
  public async getAsync(
    userId: string,
    excludeFinishedCases?: boolean,
    previousKataId?: string
  ): NullOrAsync<Kata> {
    const filterQuery = excludeFinishedCases
      ? {
          answers: {
            none: {
              userId,
              isCorrect: true,
            },
          },
        }
      : {};

    const excludePreviousKata = previousKataId
      ? {
          NOT: {
            answers: {
              some: {
                kataId: previousKataId,
              },
            },
          },
        }
      : {};

    const result = await this._prismaService.kata.findFirst({
      where: {
        ...excludePreviousKata,
        ...filterQuery,
      },
      include: {
        answers: true,
        solution: true,
        content: {
          include: {
            programmingLanguage: true,
          },
        },
      },
      orderBy: {
        id: Math.random() > 0.5 ? 'asc' : 'desc',
      },
    });

    if (isNull(result)) {
      return null;
    }

    return KataMapper.toDomain(result);
  }

  public async getByIdAsync(id: string): NullOrAsync<Kata> {
    const result = await this._prismaService.kata.findFirst({
      where: {
        id,
      },
      include: {
        solution: true,
        content: true,
      },
    });

    if (isNull(result)) {
      return null;
    }

    return KataMapper.toDomain({ ...result, answers: [] });
  }

  // TODO: Test whether this works as expected
  // perhaps I could move to multiple save methods to make my life more pleasant
  // or implement some kind of change tracking
  public async saveAsync(kata: Kata): Promise<void> {
    const { solution, answers, ...model } = KataMapper.toModel(kata);

    // TODO: What about deleting answers that im not including?
    try {
      await this._prismaService.kata.upsert({
        where: {
          id: kata.id,
        },
        create: {
          id: model.id,
          content: {
            connectOrCreate: {
              where: {
                id: model.content.id,
              },
              create: {
                id: this.generateId(),
                lines: cast<string>(model.content.lines),
                programmingLanguageId: model.content.programmingLanguageId,
              },
            },
          },
          solution: {
            connect: {
              id: solution.id,
            },
          },
          answers: {
            connectOrCreate: answers.map((answer) => ({
              where: {
                id: answer.id,
              },
              create: {
                id: answer.id,
                smell: answer.smell,
                userId: answer.userId,
                isCorrect: answer.isCorrect,
              },
            })),
          },
        },
        update: {
          answers: {
            connectOrCreate: answers.map((answer) => ({
              where: {
                id: answer.id,
              },
              create: {
                id: answer.id,
                smell: answer.smell,
                userId: answer.userId,
                isCorrect: answer.isCorrect,
              },
            })),
          },
        },
      });
    } catch (err: any) {
      this._logger.error(err.message);
    }
  }

  public generateId(): string {
    return v4();
  }
}
