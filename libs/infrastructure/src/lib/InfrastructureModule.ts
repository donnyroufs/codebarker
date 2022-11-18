import { ContainerModule } from 'inversify';

import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
  IKataRepository,
  KataRepositoryToken,
} from '@codebarker/domain';
import {
  FetchMyAnalysisReportsToken,
  GithubApiToken,
  LoggerToken,
} from '@codebarker/application';

import { PrismaService } from './drivers/prisma/PrismaService';
import { PrismaKataRepositoryImpl } from './drivers/prisma/repositories/PrismaKataRepositoryImpl';
import { LoggerLogTailImpl } from './logger/LoggerLogTailImpl';
import { DevelopmentLoggerImpl } from './logger/DevelopmentLoggerImpl';
import { GithubApi } from './githubApi/GithubApi';
import { PrismaAnalysisRepositoryImpl } from './drivers/prisma/repositories/PrismaAnalysisRepositoryImpl';
import { ConfigService } from './ConfigService';
import { FetchMyAnalysisReportsPrismaFetcherImpl } from './drivers/prisma/fetchers/FetchMyAnalysisReportsPrismaFetcherImpl';

export class InfrastructureModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      const isProd = process.env.NODE_ENV === 'production';

      bind(ConfigService).toSelf().inSingletonScope();
      bind(PrismaService)
        .toDynamicValue((ctx) => {
          return PrismaService.make(ctx.container.get(ConfigService));
        })
        .inSingletonScope();

      bind<IKataRepository>(KataRepositoryToken)
        .to(PrismaKataRepositoryImpl)
        .inSingletonScope();
      bind<IAnalysisRepository>(AnalysisRepositoryToken)
        .to(PrismaAnalysisRepositoryImpl)
        .inSingletonScope();

      bind(LoggerToken)
        .to(isProd ? LoggerLogTailImpl : DevelopmentLoggerImpl)
        .inSingletonScope();

      bind(FetchMyAnalysisReportsToken)
        .to(FetchMyAnalysisReportsPrismaFetcherImpl)
        .inSingletonScope();

      bind(GithubApiToken).to(GithubApi).inSingletonScope();
    });
  }
}
