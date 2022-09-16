import z from 'zod';

import { Smell } from '@codebarker/domain';
import {
  ISubmitAnalysisRequest,
  SubmitAnalysisUseCase,
} from '@codebarker/application';

import { ensureAuthenticated, withSession } from '../../rpc';
import { container } from '../../container';
import { contentDtoSchema } from '../../schemas/ContentDtoSchema';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

const schema = z.object({
  sha: z.string().optional(),
  smell: z.nativeEnum(Smell),
  reason: z.string(),
  userId: z.string(),
  repositoryName: z.string(),
  author: z.string(),
  fileDir: z.string(),
  content: contentDtoSchema,
});

export const submitAnalysis = async (
  request: ISubmitAnalysisRequest
): Promise<void> =>
  withSession(async (session): Promise<void> => {
    const userId = session!.user!.id;

    if (userId !== request.userId) {
      throw new Error('You are not authorized to access this resource');
    }

    return container.get(SubmitAnalysisUseCase).execute(schema.parse(request));
  });
