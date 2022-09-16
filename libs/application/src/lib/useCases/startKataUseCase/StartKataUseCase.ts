import { inject, injectable } from 'inversify';
import { shuffle } from 'lodash';

import {
  IKataRepository,
  Kata,
  KataId,
  KataRepositoryToken,
  Smell,
  UserId,
} from '@codebarker/domain';
import { isNull, IUseCase } from '@codebarker/shared';

import { IStartKataRequest } from './IStartKataRequest';
import { NoAvailableKatasException } from './NoAvailableKatasException';
import { StartKataResponse } from './StartKataResponse';

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
    const kata = await this.getKataOrThrowAsync(input);

    const options = this.getOptions(kata);

    return StartKataResponse.from(kata, options);
  }

  private async shouldIncludePreviousKataId(
    input: IStartKataRequest
  ): Promise<boolean> {
    if (input.languages.length > 1 || input.languages.at(0) === 'all')
      return true;

    const count = await this._kataRepository.countByLanguages(input.languages);
    return count > 1;
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
    const langs = input.languages.at(0) === 'all' ? [] : input.languages;
    const includePreviousKataId =
      (await this.shouldIncludePreviousKataId(input)) &&
      input.previousKataId !== undefined;

    const kata = await this._kataRepository.getAsync(
      UserId.make({ value: input.userId }),
      input.excludeCompletedKatas,
      includePreviousKataId
        ? KataId.make({ value: input.previousKataId! })
        : undefined,
      langs
    );

    if (isNull(kata)) {
      throw new NoAvailableKatasException();
    }

    return kata;
  }
}
