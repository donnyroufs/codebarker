import {
  IVoteOnAnalysisRequest,
  VoteOnAnalysisUseCase,
} from '@codebarker/application';
import { z } from 'zod';

import { ensureAuthenticated, withSession } from '../../rpc';
import { container } from '../../container';
import { AnalysisType } from '@codebarker/domain';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

const schema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.nativeEnum(AnalysisType),
});

export const voteOnAnalysis = async (
  request: IVoteOnAnalysisRequest
): Promise<void> =>
  withSession((session) => {
    const userId = session!.user!.id;

    if (userId !== request.userId) {
      throw new Error('You are not authorized to access this resource');
    }

    return container.get(VoteOnAnalysisUseCase).execute(schema.parse(request));
  });
