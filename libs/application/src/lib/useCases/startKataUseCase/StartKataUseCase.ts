import { inject, injectable } from 'inversify';

import { IKataRepository, Kata, KataRepositoryToken } from '@codebarker/domain';
import { isNull, IUseCase } from '@codebarker/shared';

import { IStartKataRequest } from './IStartKataRequest';
import { NoAvailableKatasException } from './NoAvailableKatasException';
import { StartKataResponse } from './StartKataResponse';
import { StartKataRequestValidator } from './StartKataRequestValidator';

@injectable()
export class StartKataUseCase
  implements IUseCase<IStartKataRequest, StartKataResponse>
{
  private readonly _kataRepository: IKataRepository;

  public constructor(
    @inject(KataRepositoryToken) kataRepository: IKataRepository
  ) {
    this._kataRepository = kataRepository;
  }

  public async execute(input: IStartKataRequest): Promise<StartKataResponse> {
    this.validateOrThrow(input);

    const kata = await this.getKataOrThrowAsync(input);

    return StartKataResponse.from(kata);
  }

  private async getKataOrThrowAsync(input: IStartKataRequest): Promise<Kata> {
    this.validateOrThrow(input);

    const kata = await this._kataRepository.getAsync(
      input.userId,
      input.excludeCompletedKatas
    );

    if (isNull(kata)) {
      throw new NoAvailableKatasException();
    }

    return kata;
  }

  private validateOrThrow(input: IStartKataRequest): void {
    new StartKataRequestValidator(input).validateOrThrow();
  }
}
