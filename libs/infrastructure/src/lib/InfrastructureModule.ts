import { ContainerModule } from 'inversify';

import {
  AnalysisRepositoryToken,
  IAnalysisRepository,
  IKataRepository,
  KataRepositoryToken,
} from '@codebarker/domain';
import { GithubApiToken, LoggerToken } from '@codebarker/application';

import { PrismaService } from './drivers/prisma/PrismaService';
import { PrismaKataRepositoryImpl } from './drivers/prisma/repositories/PrismaKataRepositoryImpl';
import { LoggerLogTailImpl } from './logger/LoggerLogTailImpl';
import { DevelopmentLoggerImpl } from './logger/DevelopmentLoggerImpl';
import { GithubApi } from './githubApi/GithubApi';
import { PrismaAnalysisRepositoryImpl } from './drivers/prisma/repositories/PrismaAnalysisRepositoryImpl';
import { ConfigService } from './drivers/prisma/ConfigService';

export class InfrastructureModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      const isProd = process.env.NODE_ENV === 'production';

      bind(PrismaService)
        .toSelf()
        .inSingletonScope()
        .onActivation((ctx) => {
          const configService = ctx.container.get(ConfigService);

          return PrismaService.make(configService);
        });

      bind<IKataRepository>(KataRepositoryToken)
        .to(PrismaKataRepositoryImpl)
        .inSingletonScope();
      bind<IAnalysisRepository>(AnalysisRepositoryToken)
        .to(PrismaAnalysisRepositoryImpl)
        .inSingletonScope();

      bind(LoggerToken)
        .to(isProd ? LoggerLogTailImpl : DevelopmentLoggerImpl)
        .inSingletonScope();

      bind(GithubApiToken).to(GithubApi).inSingletonScope();
    });
  }
}
