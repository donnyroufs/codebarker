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

export const getAnalysisDetails = async (
  request: IGetAnalysisDetailsRequest
): Promise<GetAnalysisDetailsResponse> =>
  container.get(GetAnalysisDetailsUseCase).execute(request);
