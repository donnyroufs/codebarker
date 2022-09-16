import { NextRpcConfig } from 'next-rpc';
import z from 'zod';

import {
  ISubmitKataRequest,
  SubmitKataResponse,
  SubmitKataUseCase,
} from '@codebarker/application';

import { container } from '../../container';
import { ensureAuthenticated, withSession } from '../../rpc';
import { Smell } from '@codebarker/domain';

export const config: NextRpcConfig = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

const schema = z.object({
  kataId: z.string(),
  userId: z.string(),
  smell: z.nativeEnum(Smell),
});

export const submitKata = async (
  request: ISubmitKataRequest
): Promise<SubmitKataResponse> =>
  withSession(async (session) => {
    const userId = session!.user!.id;

    if (userId !== request.userId) {
      throw new Error('You are not authorized to access this resource');
    }

    return container.get(SubmitKataUseCase).execute(schema.parse(request));
  });
