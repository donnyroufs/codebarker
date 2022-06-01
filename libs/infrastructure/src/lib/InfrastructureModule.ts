import { ContainerModule } from 'inversify';

import { KataRepositoryToken } from '@codebarker/domain';

import { PrismaService } from './drivers/prisma/PrismaService';
import { PrismaKataRepositoryImpl } from './drivers/prisma/repositories/PrismaKataRepositoryImpl';
import { LoggerToken } from '@codebarker/application';
import { LoggerLogTailImpl } from './logger/LoggerLogTailImpl';
import { DevelopmentLoggerImpl } from './logger/DevelopmentLoggerImpl';

export class InfrastructureModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      const isDev = process.env.NODE_ENV === 'development';

      bind(PrismaService).toSelf().inSingletonScope();
      bind(KataRepositoryToken).to(PrismaKataRepositoryImpl).inSingletonScope();
      bind(LoggerToken)
        .to(isDev ? DevelopmentLoggerImpl : LoggerLogTailImpl)
        .inSingletonScope();
    });
  }
}
