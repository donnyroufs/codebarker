import { IKataRepository } from '@codebarker/domain';
import { IUseCase, ValidationException } from '@codebarker/shared';

import { IStartKataRequest } from './IStartKataRequest';
import { NoAvailableKatasException } from './NoAvailableKatasException';
import { StartKataResponse } from './StartKataResponse';

export class StartKataUseCase
  implements IUseCase<IStartKataRequest, StartKataResponse>
{
  private readonly _caseRepository: IKataRepository;

  public constructor(investigatorRepository: IKataRepository) {
    this._caseRepository = investigatorRepository;
  }

  public async execute(input: IStartKataRequest): Promise<StartKataResponse> {
    this.throwWhenInvalidInput(input);

    const kata = await this.getKataOrThrowAsync(input);

    return StartKataResponse.from(kata);
  }

  private async getKataOrThrowAsync(input: IStartKataRequest) {
    const kata = await this._caseRepository.getAsync(
      input.excludeCompletedKatas
    );

    if (!kata) {
      throw new NoAvailableKatasException();
    }

    return kata;
  }

  private throwWhenInvalidInput(input: IStartKataRequest) {
    if (typeof input.userId !== 'string') {
      throw new ValidationException('The user id has to be of type String');
    }

    if (
      input.excludeCompletedKatas &&
      typeof input.excludeCompletedKatas !== 'boolean'
    ) {
      throw new ValidationException(
        'The exclude finished cases filter has to be of type Boolean'
      );
    }
  }
}
