import { IKataRepository, KataRepositoryToken } from '@codebarker/domain';
import { IUseCase } from '@codebarker/shared';
import { inject, injectable } from 'inversify';

import { GetProgrammingLanguagesResponse } from './GetProgrammingLanguagesResponse';

@injectable()
export class GetProgrammingLanguagesUseCase
  implements IUseCase<never, GetProgrammingLanguagesResponse>
{
  private readonly _kataRepository: IKataRepository;

  public constructor(
    @inject(KataRepositoryToken) kataRepository: IKataRepository
  ) {
    this._kataRepository = kataRepository;
  }

  public async execute(): Promise<GetProgrammingLanguagesResponse> {
    const languages = await this._kataRepository.getProgrammingLanguagesAsync();

    return GetProgrammingLanguagesResponse.from(languages);
  }
}
