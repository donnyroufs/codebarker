export interface IGithubApi {
  getFileContents(
    author: string,
    repositoryName: string,
    fileDir: string,
    sha?: string
  ): Promise<string>;
}

export const GithubApiToken = Symbol('GithubApiToken');
