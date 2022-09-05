import { Octokit } from 'octokit';
import { inject, injectable } from 'inversify';

import {
  IGithubApi,
  UnknownProgrammingLanguageException,
} from '@codebarker/application';
import {
  Content,
  IKataRepository,
  KataRepositoryToken,
  Line,
  ProgrammingLanguage,
} from '@codebarker/domain';
import { GithubRepositoryUrlParser } from '@codebarker/shared';

@injectable()
export class GithubApi implements IGithubApi {
  private readonly _octo: Octokit;
  private readonly _kataRepository: IKataRepository;

  public constructor(
    @inject(KataRepositoryToken) kataRepository: IKataRepository
  ) {
    this._kataRepository = kataRepository;
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

    const ext = GithubRepositoryUrlParser.getFileExtension(fileDir);

    const language =
      await this._kataRepository.getProgrammingLanguageByExtAsync(ext);

    if (!language) {
      throw new UnknownProgrammingLanguageException(ext);
    }

    return this.mapCodeToContent(code, language);
  }

  private mapCodeToContent(
    code: string,
    language: ProgrammingLanguage
  ): Content {
    const arr = code.split('\n');

    return Content.make({
      lines: arr.map((line, index) =>
        Line.make({ isInfected: false, lineNumber: index, value: line })
      ),
      programmingLanguage: language,
    });
  }
}
