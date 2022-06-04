import { Prisma } from '@prisma/client';

const analysis = Prisma.validator<Prisma.AnalysisArgs>()({
  include: {
    user: true,
    content: true,
  },
});

export type AnalysisModel = Prisma.AnalysisGetPayload<typeof analysis>;
