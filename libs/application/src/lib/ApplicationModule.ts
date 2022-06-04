import { ContainerModule } from 'inversify';
import {
  GetFileContentFromGithubUseCase,
  SubmitAnalysisUseCase,
  SubmitKataUseCase,
} from './useCases';

import { StartKataUseCase } from './useCases/startKataUseCase/StartKataUseCase';

export class ApplicationModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind(StartKataUseCase).toSelf().inSingletonScope();
      bind(SubmitKataUseCase).toSelf().inSingletonScope();
      bind(GetFileContentFromGithubUseCase).toSelf().inSingletonScope();
      bind(SubmitAnalysisUseCase).toSelf().inSingletonScope();
    });
  }
}
