import { ContainerModule } from 'inversify';

import { StartKataUseCase } from './useCases/startKataUseCase/StartKataUseCase';

export class ApplicationModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind(StartKataUseCase).toSelf().inSingletonScope();
    });
  }
}
