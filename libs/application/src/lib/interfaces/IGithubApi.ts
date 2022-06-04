import { Content } from '@codebarker/domain';

export interface IGithubApi {
  getFileContents(
    author: string,
    repositoryName: string,
    fileDir: string,
    sha?: string
  ): Promise<Content>;
}

export const GithubApiToken = Symbol('GithubApiToken');
