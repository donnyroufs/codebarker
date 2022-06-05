import { Prisma } from '@prisma/client';

const content = Prisma.validator<Prisma.ContentArgs>()({
  include: {
    programmingLanguage: true,
    kata: false,
    analysis: false,
  },
});

export type ContentModel = Prisma.ContentGetPayload<typeof content>;
