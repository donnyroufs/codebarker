import { v4 } from 'uuid';
import { injectable } from 'inversify';

import { IKataRepository, Kata } from '@codebarker/domain';
import { isNull, NullOrAsync } from '@codebarker/shared';

import { PrismaService } from '../PrismaService';
import { KataMapper } from '../mappers/KataMapper';

@injectable()
export class PrismaKataRepositoryImpl implements IKataRepository {
  private readonly _prismaService: PrismaService;

  public constructor(prismaService: PrismaService) {
    this._prismaService = prismaService;
  }

  // TODO: Abstract filters
  // TODO: Write an integration test against the filters
  public async getAsync(
    userId: string,
    excludeFinishedCases?: boolean,
    previousKataId?: string
  ): NullOrAsync<Kata> {
    const filterQuery = excludeFinishedCases
      ? {
          answers: {
            none: {
              userId,
              isCorrect: true,
            },
          },
        }
      : {};

    const excludePreviousKata = previousKataId
      ? {
          NOT: {
            answers: {
              some: {
                kataId: previousKataId,
              },
            },
          },
        }
      : {};

    const result = await this._prismaService.kata.findFirst({
      where: {
        ...excludePreviousKata,
        ...filterQuery,
      },
      include: {
        answers: true,
        solution: true,
      },
    });

    if (isNull(result)) {
      return null;
    }

    return KataMapper.toDomain(result);
  }

  public async getByIdAsync(id: string): NullOrAsync<Kata> {
    const result = await this._prismaService.kata.findFirst({
      where: {
        id,
      },
      include: {
        answers: true,
        solution: true,
      },
    });

    if (isNull(result)) {
      return null;
    }

    return KataMapper.toDomain(result);
  }

  // TODO: Test whether this works as expected
  // perhaps I could move to multiple save methods to make my life more pleasant
  // or implement some kind of change tracking
  public async saveAsync(kata: Kata): Promise<void> {
    const { solution, answers, ...model } = KataMapper.toModel(kata);

    // TODO: What about deleting answers that im not including?
    await this._prismaService.kata.upsert({
      where: {
        id: kata.id,
      },
      create: {
        id: model.id,
        // TODO: Fix type
        content: model.content as string,
        solution: {
          connect: {
            id: solution.id,
          },
        },
        answers: {
          connectOrCreate: answers.map((answer) => ({
            where: {
              id: answer.id,
            },
            create: {
              id: answer.id,
              smell: answer.smell,
              userId: answer.userId,
              isCorrect: answer.isCorrect,
            },
          })),
        },
      },
      update: {
        answers: {
          connectOrCreate: answers.map((answer) => ({
            where: {
              id: answer.id,
            },
            create: {
              id: answer.id,
              smell: answer.smell,
              userId: answer.userId,
              isCorrect: answer.isCorrect,
            },
          })),
        },
      },
    });
  }

  public generateId(): string {
    return v4();
  }
}
