import { NextRpcConfig } from 'next-rpc';

import {
  ISubmitKataRequest,
  SubmitKataResponse,
  SubmitKataUseCase,
} from '@codebarker/application';

import { container } from '../../container';
import { ensureAuthenticated, withSession } from '../../rpc';

export const config: NextRpcConfig = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

export const submitKata = async (
  request: ISubmitKataRequest
): Promise<SubmitKataResponse> =>
  withSession(async (session) => {
    const userId = session!.user!.id;

    if (userId !== request.userId) {
      // TODO: How to propogate to client
      throw new Error('You are not authorized to access this resource');
    }

    return container.get(SubmitKataUseCase).execute(request);
  });
