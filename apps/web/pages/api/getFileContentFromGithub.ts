import z from 'zod';

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

const schema = z.object({
  author: z.string(),
  repositoryName: z.string(),
  fileDir: z.string(),
  sha: z.string().optional(),
});

export const getFileContentFromGithub = async (
  request: IGetFileContentFromGithubRequest
): Promise<GetFileContentFromGithubResponse> =>
  container.get(GetFileContentFromGithubUseCase).execute(schema.parse(request));
