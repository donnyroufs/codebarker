import {
  GetFileContentFromGithubResponse,
  GetFileContentFromGithubUseCase,
  IGetFileContentFromGithubRequest,
} from '@codebarker/application';

import { ensureAuthenticated } from '../../rpc';
import { container } from '../../container';

export const config = {
  rpc: true,
  wrapMethod: ensureAuthenticated,
};

export const getFileContentFromGithub = async (
  request: IGetFileContentFromGithubRequest
): Promise<GetFileContentFromGithubResponse> =>
  container.get(GetFileContentFromGithubUseCase).execute(request);
