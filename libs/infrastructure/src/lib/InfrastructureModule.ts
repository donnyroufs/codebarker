import { ContainerModule } from 'inversify';

import { PrismaService } from './drivers/prisma/PrismaService';
import { PrismaKataRepositoryImpl } from './drivers/prisma/repositories/PrismaKataRepositoryImpl';

export class InfrastructureModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind(PrismaService).toSelf().inSingletonScope();
      bind(PrismaKataRepositoryImpl).toSelf().inSingletonScope();
    });
  }
}
