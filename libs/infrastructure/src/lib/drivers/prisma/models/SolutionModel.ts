import { Prisma } from '@prisma/client';

const solution = Prisma.validator<Prisma.SolutionArgs>()({
  include: {},
});

export type SolutionModel = Prisma.SolutionGetPayload<typeof solution>;
