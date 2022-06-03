import {
  ISubmitAnalysisRequest,
  SubmitAnalysisUseCase,
} from '@codebarker/application';

import { ensureAuthenticated, withSession } from '../../rpc';
import { container } from '../../container';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

export const submitAnalysis = async (
  request: ISubmitAnalysisRequest
): Promise<void> =>
  withSession(async (session): Promise<void> => {
    const userId = session!.user!.id;

    if (userId !== request.userId) {
      // TODO: How to propogate to client
      throw new Error('You are not authorized to access this resource');
    }

    return container.get(SubmitAnalysisUseCase).execute(request);
  });
