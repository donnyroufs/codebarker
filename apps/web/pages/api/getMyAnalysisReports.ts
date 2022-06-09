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

export const getMyAnalysisReports = async (
  request: IGetMyAnalysisReportsRequest
): Promise<GetMyAnalysisReportsResponse> =>
  container.get(GetMyAnalysisReportsUseCase).execute(request);
