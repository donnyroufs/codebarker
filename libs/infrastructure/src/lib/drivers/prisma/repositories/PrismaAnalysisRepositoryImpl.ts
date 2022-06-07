import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { cast, NullOrAsync } from '@codebarker/shared';
import { ILogger, LoggerToken } from '@codebarker/application';
import {
  Analysis,
  AnalysisDetails,
  IAnalysisRepository,
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

  public async getDetailsAsync(id: string): NullOrAsync<AnalysisDetails> {
    const analysis = await this._prismaService.analysis.findFirst({
      where: {
        id,
      },
      include: {
        content: true,
        user: true,
        votes: true,
      },
    });

    if (!analysis) {
      return null;
    }

    return AnalysisDetailsMapper.toDomain(analysis);
  }

  public async getByIdAsync(id: string): NullOrAsync<Analysis> {
    const model = await this._prismaService.analysis.findFirst({
      where: {
        id,
      },
      include: {
        content: true,
        user: true,
        votes: true,
      },
    });

    if (!model) return null;

    return AnalysisMapper.toDomain(model);
  }

  // TODO: Check if this doesnt delete votes, and adds new votes
  public async saveAsync(analysis: Analysis): Promise<void> {
    const { content, ...model } = AnalysisMapper.toModel(analysis);

    await this._prismaService.analysis.upsert({
      where: {
        id: content.id,
      },
      create: {
        author: model.author,
        fileDir: model.fileDir,
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
    });
  }

  public generateId(): string {
    return v4();
  }
}
