import { Prisma } from '@prisma/client';

const answer = Prisma.validator<Prisma.AnswerArgs>()({
  include: {},
});

export type AnswerModel = Prisma.AnswerGetPayload<typeof answer>;
