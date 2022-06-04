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

export const startKata = async (
  request: IStartKataRequest
): Promise<StartKataResponse> =>
  withSession(async (session) => {
    const userId = session!.user!.id;

    if (userId !== request.userId) {
      // TODO: How to propogate to client
      throw new Error('You are not authorized to access this');
    }

    return container.get(StartKataUseCase).execute(request);
  });
