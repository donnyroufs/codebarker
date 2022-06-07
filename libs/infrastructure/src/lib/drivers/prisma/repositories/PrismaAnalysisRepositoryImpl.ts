import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { cast, NullOrAsync } from '@codebarker/shared';
import { ILogger, LoggerToken } from '@codebarker/application';
import { Analysis, IAnalysisRepository } from '@codebarker/domain';

import { PrismaService } from '../PrismaService';
import { AnalysisMapper } from '../mappers/AnalysisMapper';

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

  public async getByIdAsync(id: string): NullOrAsync<Analysis> {
    throw new Error('Method not implemented.');
  }

  public async saveAsync(analysis: Analysis): Promise<void> {
    const { content, ...model } = AnalysisMapper.toModel(analysis);

    await this._prismaService.analysis.create({
      data: {
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
