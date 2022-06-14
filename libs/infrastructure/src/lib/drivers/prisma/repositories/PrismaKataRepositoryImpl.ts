import { v4 } from 'uuid';
import { injectable, inject } from 'inversify';

import { IKataRepository, Kata, ProgrammingLanguage } from '@codebarker/domain';
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

  public async countByLanguages(languages: string[]): Promise<number> {
    return this._prismaService.kata.count({
      where: {
        content: {
          programmingLanguageName: {
            in: languages,
          },
        },
      },
    });
  }

  public async getProgrammingLanguagesAsync(): Promise<ProgrammingLanguage[]> {
    const result = await this._prismaService.programmingLanguage.findMany({
      where: {
        contents: {
          some: {
            kata: {
              some: {},
            },
          },
        },
      },
      include: {
        contents: {
          select: {
            kata: {
              distinct: 'id',
              select: {
                _count: true,
              },
            },
          },
        },
      },
    });

    return result.map((lang) =>
      ProgrammingLanguage.make({
        extension: lang.extension,
        name: lang.name,
      })
    );
  }

  public async getProgrammingLanguageByExtAsync(
    ext: string
  ): NullOrAsync<ProgrammingLanguage> {
    const result = await this._prismaService.programmingLanguage.findFirst({
      where: {
        extension: ext,
      },
    });

    if (isNull(result)) return null;

    return ProgrammingLanguage.make({
      extension: result.extension,
      name: result.name,
    });
  }

  // TODO: Abstract filters
  // TODO: Write an integration test against the filters
  public async getAsync(
    userId: string,
    excludeFinishedCases?: boolean,
    previousKataId?: string,
    languages?: string[]
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

    const languagesFilter = languages &&
      languages.length > 0 && {
        content: {
          programmingLanguage: {
            name: {
              in: languages,
            },
          },
        },
      };

    const result = await this._prismaService.kata.findFirst({
      where: {
        ...excludePreviousKata,
        ...filterQuery,
        ...languagesFilter,
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
        content: {
          include: {
            programmingLanguage: true,
          },
        },
      },
    });

    if (isNull(result)) {
      return null;
    }

    return KataMapper.toDomain({ ...result, answers: [] });
  }

  // TODO: Test whether this works as expected
  // TODO: Refactor into transaction
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
                id: model.content.id,
                lines: cast<string>(model.content.lines),
                programmingLanguage: {
                  connect: {
                    extension_name: {
                      extension: model.content.programmingLanguageExtension,
                      name: model.content.programmingLanguageName,
                    },
                  },
                },
              },
            },
          },
          solution: {
            connectOrCreate: {
              where: {
                id: solution.id,
              },
              create: {
                id: solution.id,
                type: solution.type,
              },
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
