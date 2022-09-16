import z from 'zod';

import {
  GetMyAnalysisReportsResponse,
  GetMyAnalysisReportsUseCase,
  IGetMyAnalysisReportsRequest,
} from '@codebarker/application';

import { ensureAuthenticated } from '../../rpc';
import { container } from '../../container';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

const schema = z.object({
  userId: z.string(),
  offset: z.number(),
  amount: z.number().optional(),
});

export const getMyAnalysisReports = async (
  request: IGetMyAnalysisReportsRequest
): Promise<GetMyAnalysisReportsResponse> => {
  return container
    .get(GetMyAnalysisReportsUseCase)
    .execute(schema.parse(request));
};
