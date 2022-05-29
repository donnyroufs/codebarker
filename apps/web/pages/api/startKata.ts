import {
  IStartKataRequest,
  StartKataResponse,
  StartKataUseCase,
} from '@codebarker/application';

import { container } from '../../container';

export const config = { rpc: true };

export const startKata = async (
  request: IStartKataRequest
): Promise<StartKataResponse> =>
  container.get(StartKataUseCase).execute(request);
