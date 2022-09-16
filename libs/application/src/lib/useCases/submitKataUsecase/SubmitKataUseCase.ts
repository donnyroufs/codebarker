import { inject, injectable } from 'inversify';

import { isNull, IUseCase } from '@codebarker/shared';
import {
  Answer,
  IKataRepository,
  Kata,
  KataId,
  KataRepositoryToken,
  UserId,
} from '@codebarker/domain';

import { ISubmitKataRequest } from './ISubmitKataRequest';
import { SubmitKataResponse } from './SubmitKataResponse';
import { UnknownKataException } from './UnknownKataException';
import { ILogger, LoggerToken } from '../../interfaces';

@injectable()
export class SubmitKataUseCase
  implements IUseCase<ISubmitKataRequest, SubmitKataResponse>
{
  private readonly _kataRepository: IKataRepository;
  private readonly _logger: ILogger;

  public constructor(
    @inject(KataRepositoryToken) kataRepository: IKataRepository,
    @inject(LoggerToken) logger: ILogger
  ) {
    this._kataRepository = kataRepository;
    this._logger = logger;
  }

  public async execute(input: ISubmitKataRequest): Promise<SubmitKataResponse> {
    const kata = await this.getKataOrThrowAsync(input);

    const isCorrect = kata.isCorrectAnswer(input.smell);

    const answer = Answer.make({
      id: this._kataRepository.generateId(),
      kataId: KataId.make({ value: input.kataId }),
      userId: UserId.make({ value: input.userId }),
      smell: input.smell,
      isCorrect,
    });

    // TODO: Do not count rank points when already given an answer
    kata.addAnswer(answer);

    this._logger.info(`Saving answer`, {
      kataId: kata.id,
      answer,
    });

    await this._kataRepository.saveAsync(kata);

    return SubmitKataResponse.from(isCorrect);
  }

  private async getKataOrThrowAsync(input: ISubmitKataRequest): Promise<Kata> {
    const kata = await this._kataRepository.getByIdAsync(
      KataId.make({ value: input.kataId })
    );

    if (isNull(kata)) {
      throw new UnknownKataException(input.kataId);
    }

    return kata;
  }
}
