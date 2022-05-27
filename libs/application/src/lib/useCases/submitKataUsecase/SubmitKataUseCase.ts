import { inject, injectable } from 'inversify';

import { isNull, IUseCase } from '@codebarker/shared';
import {
  Answer,
  IKataRepository,
  Kata,
  KataRepositoryToken,
} from '@codebarker/domain';

import { ISubmitKataRequest } from './ISubmitKataRequest';
import { SubmitKataResponse } from './SubmitKataResponse';
import { UnknownKataException } from './UnknownKataException';
import { SubmitKataRequestValidator } from './SubmitKataRequestValidator';

@injectable()
export class SubmitKataUseCase
  implements IUseCase<ISubmitKataRequest, SubmitKataResponse>
{
  private readonly _kataRepository: IKataRepository;

  public constructor(
    @inject(KataRepositoryToken) kataRepository: IKataRepository
  ) {
    this._kataRepository = kataRepository;
  }

  public async execute(input: ISubmitKataRequest): Promise<SubmitKataResponse> {
    this.validateOrThrow(input);

    const kata = await this.getKataOrThrowAsync(input);

    const isCorrect = kata.isCorrectAnswer(input.answerId);

    const answer = Answer.make({
      id: this._kataRepository.generateId(),
      kataId: input.kataId,
      userId: input.userId,
    });

    // TODO: Do not count rank points when already given an answer
    kata.addAnswer(answer);

    await this._kataRepository.saveAsync(kata);

    return SubmitKataResponse.from(isCorrect);
  }

  private async getKataOrThrowAsync(input: ISubmitKataRequest): Promise<Kata> {
    const kata = await this._kataRepository.getByIdAsync(input.kataId);

    if (isNull(kata)) {
      throw new UnknownKataException(input.kataId);
    }

    return kata;
  }

  private validateOrThrow(input: ISubmitKataRequest): void {
    new SubmitKataRequestValidator(input).validateOrThrow();
  }
}
