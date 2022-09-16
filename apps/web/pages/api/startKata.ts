import z from 'zod';

import {
  IStartKataRequest,
  StartKataResponse,
  StartKataUseCase,
} from '@codebarker/application';

import { ensureAuthenticated, withSession } from '../../rpc';
import { container } from '../../container';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

const schema = z.object({
  userId: z.string(),
  excludeCompletedKatas: z.boolean(),
  previousKataId: z.string().optional(),
  languages: z.array(z.string()),
});

export const startKata = async (
  request: IStartKataRequest
): Promise<StartKataResponse> =>
  withSession(async (session) => {
    const userId = session!.user!.id;

    if (userId !== request.userId) {
      throw new Error('You are not authorized to access this');
    }

    return container.get(StartKataUseCase).execute(schema.parse(request));
  });
