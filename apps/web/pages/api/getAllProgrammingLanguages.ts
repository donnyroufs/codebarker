import {
  GetProgrammingLanguagesResponse,
  GetProgrammingLanguagesUseCase,
} from '@codebarker/application';

import { ensureAuthenticated } from '../../rpc';
import { container } from '../../container';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

export const getAllProgrammingLanguages =
  async (): Promise<GetProgrammingLanguagesResponse> =>
    container.get(GetProgrammingLanguagesUseCase).execute();
