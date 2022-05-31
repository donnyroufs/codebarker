import { inject, injectable } from 'inversify';
import { shuffle } from 'lodash';

import {
  IKataRepository,
  Kata,
  KataRepositoryToken,
  Smell,
} from '@codebarker/domain';
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

    // Might need to define static options in the entity
    // becuase users could techincally cheat by reloading
    // the kata a couple times and checking which smell
    // didnt get removed.
    const options = this.getOptions(kata);

    return StartKataResponse.from(kata, options);
  }

  private getOptions(kata: Kata): Smell[] {
    const correctSmell = kata.solution.type;

    const values = Object.values(Smell)
      .filter((smell) => smell !== correctSmell)
      .filter((v) => typeof v !== 'string');

    const picked: Smell[] = [correctSmell];

    while (picked.length !== 4) {
      const pickedSmell = this.pickItemFromSmells(values as any);

      if (!picked.includes(pickedSmell)) {
        picked.push(pickedSmell);
      }
    }

    return shuffle(picked);
  }

  private pickItemFromSmells(values: number[]): Smell {
    const randomIndex = Math.floor(Math.random() * values.length);

    const item = values[randomIndex];

    return item;
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
