import z from 'zod';

import {
  GetMyAnalysisReportsResponse,
  GetMyAnalysisReportsUseCase,
} from '@codebarker/application';

import { ensureAuthenticated } from '../../rpc';
import { container } from '../../container';
import { UserId } from '@codebarker/domain';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

const schema = z.object({
  userId: z.string(),
  offset: z.number(),
  amount: z.number(),
});

interface IGetMyAnalysisReportsRequest {
  userId: string;
  offset: number;
  amount: number;
}

export const getMyAnalysisReports = async (
  request: IGetMyAnalysisReportsRequest
): Promise<GetMyAnalysisReportsResponse> => {
  return container.get(GetMyAnalysisReportsUseCase).execute({
    ...schema.parse(request),
    userId: UserId.make({ value: request.userId }),
  });
};
