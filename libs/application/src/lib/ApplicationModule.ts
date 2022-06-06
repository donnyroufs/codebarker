import { ContainerModule } from 'inversify';

import {
  GetFileContentFromGithubUseCase,
  GetProgrammingLanguagesUseCase,
  SubmitAnalysisUseCase,
  SubmitKataUseCase,
  VoteOnAnalysisUseCase,
  StartKataUseCase,
} from './useCases';

export class ApplicationModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind(StartKataUseCase).toSelf().inSingletonScope();
      bind(SubmitKataUseCase).toSelf().inSingletonScope();
      bind(GetFileContentFromGithubUseCase).toSelf().inSingletonScope();
      bind(SubmitAnalysisUseCase).toSelf().inSingletonScope();
      bind(GetProgrammingLanguagesUseCase).toSelf().inSingletonScope();
      bind(VoteOnAnalysisUseCase).toSelf().inSingletonScope();
    });
  }
}
