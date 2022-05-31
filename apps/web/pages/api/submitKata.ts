import {
  ISubmitKataRequest,
  SubmitKataResponse,
  SubmitKataUseCase,
} from '@codebarker/application';

import { container } from '../../container';

export const config = { rpc: true };

export const submitKata = async (
  request: ISubmitKataRequest
): Promise<SubmitKataResponse> =>
  container.get(SubmitKataUseCase).execute(request);
