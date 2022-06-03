import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { cast } from '@codebarker/shared';
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

  public async saveAsync(analysis: Analysis): Promise<void> {
    const { content, ...model } = AnalysisMapper.toModel(analysis);

    await this._prismaService.analysis.create({
      data: {
        ...model,
        content: cast<string>(content),
      },
    });
  }

  public generateId(): string {
    return v4();
  }
}
