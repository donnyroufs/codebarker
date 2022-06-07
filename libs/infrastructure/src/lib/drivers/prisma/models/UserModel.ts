import { Prisma } from '@prisma/client';

const user = Prisma.validator<Prisma.UserArgs>()({
  include: {},
});

export type UserModel = Prisma.UserGetPayload<typeof user>;
