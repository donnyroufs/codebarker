import { Some } from 'ts-results';

import { IUseCase } from '@codebarker/shared';
import { IKataRepository, Kata } from '@codebarker/domain';

import { ISubmitKataRequest } from './ISubmitKataRequest';
import { SubmitKataResponse } from './SubmitKataResponse';
import { UnknownKataException } from './UnknownKataException';
import { SubmitKataRequestValidator } from './SubmitKataRequestValidator';

export class SubmitKataUseCase
  implements IUseCase<ISubmitKataRequest, SubmitKataResponse>
{
  private readonly _kataRepository: IKataRepository;

  public constructor(kataRepository: IKataRepository) {
    this._kataRepository = kataRepository;
  }

  public async execute(input: ISubmitKataRequest): Promise<SubmitKataResponse> {
    this.validateOrThrow(input);

    const kata = await this.getKataOrThrowAsync(input);

    const isCorrect = kata.val.isCorrectAnswer(input.answerId);

    await this._kataRepository.saveAsync(kata.val);

    return SubmitKataResponse.from(isCorrect);
  }

  private async getKataOrThrowAsync(
    input: ISubmitKataRequest
  ): Promise<Some<Kata>> {
    const kata = await this._kataRepository.getByIdAsync(input.kataId);

    if (kata.none) {
      throw new UnknownKataException(input.kataId);
    }

    return kata;
  }

  private validateOrThrow(input: ISubmitKataRequest): void {
    new SubmitKataRequestValidator(input).validateOrThrow();
  }
}
