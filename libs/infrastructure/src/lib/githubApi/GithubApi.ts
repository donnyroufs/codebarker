import { Octokit } from 'octokit';
import { injectable } from 'inversify';

import { IGithubApi } from '@codebarker/application';
import { Content, Line } from '@codebarker/domain';

@injectable()
export class GithubApi implements IGithubApi {
  private readonly _octo: Octokit;

  public constructor() {
    this._octo = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
    });
  }

  public async getFileContents(
    author: string,
    repositoryName: string,
    fileDir: string,
    sha?: string
  ): Promise<Content> {
    const res = await this._octo.rest.repos.getContent({
      owner: author,
      path: fileDir,
      repo: repositoryName,
      ref: sha,
    });

    // @ts-expect-error typescript is on crack
    const code = Buffer.from(res.data.content, 'base64').toString();

    return this.mapCodeToContent(code);
  }

  private mapCodeToContent(code: string): Content {
    const arr = code.split('\n');

    return Content.make({
      lines: arr.map((line, i) => Line.make(i, line)),
    });
  }
}
