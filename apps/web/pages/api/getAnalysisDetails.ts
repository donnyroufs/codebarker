import z from 'zod';

import {
  GetAnalysisDetailsResponse,
  GetAnalysisDetailsUseCase,
  IGetAnalysisDetailsRequest,
} from '@codebarker/application';

import { ensureAuthenticated } from '../../rpc';
import { container } from '../../container';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

const schema = z.object({
  userId: z.string(),
  languages: z.array(z.string()),
});

export const getAnalysisDetails = async (
  request: IGetAnalysisDetailsRequest
): Promise<GetAnalysisDetailsResponse> =>
  container.get(GetAnalysisDetailsUseCase).execute(schema.parse(request));
