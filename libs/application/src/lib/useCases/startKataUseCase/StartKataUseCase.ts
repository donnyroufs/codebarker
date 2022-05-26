import { inject, injectable } from 'inversify';

import { IKataRepository, Kata, KataRepositoryToken } from '@codebarker/domain';
import { IUseCase } from '@codebarker/shared';

import { IStartKataRequest } from './IStartKataRequest';
import { NoAvailableKatasException } from './NoAvailableKatasException';
import { StartKataResponse } from './StartKataResponse';
import { StartKataRequestValidator } from './StartKataRequestValidator';

@injectable()
export class StartKataUseCase
  implements IUseCase<IStartKataRequest, StartKataResponse>
{
  private readonly _caseRepository: IKataRepository;

  public constructor(
    @inject(KataRepositoryToken) investigatorRepository: IKataRepository
  ) {
    this._caseRepository = investigatorRepository;
  }

  public async execute(input: IStartKataRequest): Promise<StartKataResponse> {
    this.throwWhenInvalidInput(input);

    const kata = await this.getKataOrThrowAsync(input);

    return StartKataResponse.from(kata);
  }

  private async getKataOrThrowAsync(input: IStartKataRequest): Promise<Kata> {
    this.throwWhenInvalidInput(input);

    const kata = await this._caseRepository.getAsync(
      input.excludeCompletedKatas
    );

    if (kata.none) {
      throw new NoAvailableKatasException();
    }

    return kata.val;
  }

  private throwWhenInvalidInput(input: IStartKataRequest): void {
    new StartKataRequestValidator(input).validateOrThrow().unwrap();
  }
}
