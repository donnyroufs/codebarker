import { ContainerModule } from 'inversify';

import { KataRepositoryToken } from '@codebarker/domain';

import { PrismaService } from './drivers/prisma/PrismaService';
import { PrismaKataRepositoryImpl } from './drivers/prisma/repositories/PrismaKataRepositoryImpl';

export class InfrastructureModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind(PrismaService).toSelf().inSingletonScope();
      bind(KataRepositoryToken).to(PrismaKataRepositoryImpl).inSingletonScope();
    });
  }
}
