import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { cast, EntityId, NullOrAsync } from '@codebarker/shared';
import { ILogger, LoggerToken } from '@codebarker/application';
import {
  Analysis,
  AnalysisDetails,
  AnalysisId,
  AnalysisStatus,
  IAnalysisRepository,
  PaginatedAnalysisDetails,
} from '@codebarker/domain';

import { PrismaService } from '../PrismaService';
import { AnalysisMapper } from '../mappers/AnalysisMapper';
import { AnalysisDetailsMapper } from '../mappers/AnalysisDetailsMapper';

@injectable()
export class PrismaAnalysisRepositoryImpl implements IAnalysisRepository {
  private readonly _prismaService: PrismaService;
  private readonly _logger: ILogger;

  public constructor(
    prismaService: PrismaService,
    @inject(LoggerToken) logger: ILogger
  ) {
    this._prismaService = prismaService;
    this._logger = logger;
  }

  public async getPaginatedAnalysisDetailsForUserAsync(
    userId: string,
    offset: number,
    amount: number
  ): Promise<PaginatedAnalysisDetails> {
    const count = await this._prismaService.analysis.count({
      where: {
        userId,
      },
    });

    const result = await this._prismaService.analysis.findMany({
      where: {
        userId,
      },
      skip: offset * amount,
      take: amount,
      include: {
        content: {
          include: {
            programmingLanguage: true,
          },
        },
        user: true,
        votes: true,
      },
    });

    return {
      details: result.map(AnalysisDetailsMapper.toDomain),
      hasMore: this.hasMore(result.length, amount, offset, count),
      count,
    };
  }

  // TODO: Integration test whether it excludes the user resources
  // TODO: Integration test that it does not get resources where the user has already voted
  // TODO: Integration test that it filters by language
  public async getAnalysisWithoutVotesForUserAsync(
    userId: string,
    languages: string[]
  ): NullOrAsync<AnalysisDetails> {
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

    const details = await this._prismaService.analysis.findFirst({
      where: {
        ...languagesFilter,
        votes: {
          none: {
            userId,
          },
        },
        status: AnalysisStatus.Pending,
        userId: {
          not: userId,
        },
      },
      include: {
        content: {
          include: {
            programmingLanguage: true,
          },
        },
        user: true,
        votes: true,
      },
    });

    if (!details) {
      return null;
    }

    return AnalysisDetailsMapper.toDomain(details);
  }

  public async getDetailsAsync(id: string): NullOrAsync<AnalysisDetails> {
    const analysis = await this._prismaService.analysis.findFirst({
      where: {
        id,
      },
      include: {
        content: {
          include: {
            programmingLanguage: true,
          },
        },
        user: true,
        votes: true,
      },
    });

    if (!analysis) {
      return null;
    }

    return AnalysisDetailsMapper.toDomain(analysis);
  }

  public async getByIdAsync(id: AnalysisId): NullOrAsync<Analysis> {
    const model = await this._prismaService.analysis.findFirst({
      where: {
        id: id.value,
      },
      include: {
        content: {
          include: {
            programmingLanguage: true,
          },
        },
        user: true,
        votes: true,
      },
    });

    if (!model) return null;

    return AnalysisMapper.toDomain(model);
  }

  public async saveAsync(analysis: Analysis): Promise<void> {
    const { content, ...model } = AnalysisMapper.toModel(analysis);

    await this._prismaService.analysis
      .upsert({
        where: {
          id: model.id,
        },
        create: {
          author: model.author,
          fileDir: model.fileDir,
          id: model.id,
          reason: model.reason,
          repositoryName: model.repositoryName,
          smell: model.smell,
          status: model.status,
          user: {
            connect: {
              id: model.userId,
            },
          },
          votes: {
            createMany: {
              data: model.votes,
              skipDuplicates: true,
            },
          },
          sha: model.sha,
          content: {
            create: {
              id: content.id,
              lines: cast<string>(content.lines),
              programmingLanguage: {
                connect: {
                  extension_name: {
                    extension: analysis.content.programmingLanguage.extension,
                    name: analysis.content.programmingLanguage.name,
                  },
                },
              },
            },
          },
        },
        update: {
          author: model.author,
          fileDir: model.fileDir,
          status: model.status,
          id: model.id,
          reason: model.reason,
          repositoryName: model.repositoryName,
          smell: model.smell,
          user: {
            connect: {
              id: model.userId,
            },
          },
          votes: {
            createMany: {
              data: model.votes,
              skipDuplicates: true,
            },
          },
          sha: model.sha,
        },
      })
      .catch((err) => this._logger.error(err, { analysis }));
  }

  private hasMore(
    fetchedCount: number,
    amountToFetch: number,
    offset: number,
    totalCount: number
  ): boolean {
    if (fetchedCount < amountToFetch) return false;
    if (this.getTotalFetched(offset, amountToFetch) >= totalCount) return false;

    return true;
  }

  private getTotalFetched(offset: number, amountToFetch: number): number {
    return (offset + 1) * amountToFetch;
  }

  public generateId(): EntityId {
    return EntityId.make({ value: v4() });
  }
}
