import { inject, injectable } from 'inversify';

import { IUseCase } from '@codebarker/shared';

import { IGetFileContentFromGithubRequest } from './IGetFileContentFromGithubRequest';
import { GetFileContentFromGithubResponse } from './GetFileContentFromGithubResponse';
import { GetFileContentFromGithubValidator } from './GetFileContentFromGithubValidator';
import { GithubApiToken, IGithubApi } from '../../interfaces';

@injectable()
export class GetFileContentFromGithubUseCase
  implements
    IUseCase<
      IGetFileContentFromGithubRequest,
      GetFileContentFromGithubResponse
    >
{
  private readonly _githubApi: IGithubApi;

  public constructor(@inject(GithubApiToken) githubApi: IGithubApi) {
    this._githubApi = githubApi;
  }

  public async execute(
    input: IGetFileContentFromGithubRequest
  ): Promise<GetFileContentFromGithubResponse> {
    this.validateOrThrow(input);

    const content = await this._githubApi.getFileContents(
      input.author,
      input.repositoryName,
      input.fileDir,
      input.sha
    );

    const dto = GetFileContentFromGithubResponse.from(content, input);
    return dto;
  }

  private validateOrThrow(input: IGetFileContentFromGithubRequest): void {
    new GetFileContentFromGithubValidator(input).validateOrThrow();
  }
}
