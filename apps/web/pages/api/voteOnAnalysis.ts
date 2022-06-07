import {
  IVoteOnAnalysisRequest,
  VoteOnAnalysisUseCase,
} from '@codebarker/application';

import { ensureAuthenticated, withSession } from '../../rpc';
import { container } from '../../container';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

export const voteOnAnalysis = async (
  request: IVoteOnAnalysisRequest
): Promise<void> =>
  withSession((session) => {
    const userId = session!.user!.id;

    if (userId !== request.userId) {
      // TODO: How to propogate to client
      throw new Error('You are not authorized to access this resource');
    }

    return container.get(VoteOnAnalysisUseCase).execute(request);
  });
