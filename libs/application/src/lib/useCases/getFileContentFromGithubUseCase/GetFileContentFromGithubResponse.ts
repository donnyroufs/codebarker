import { IGetFileContentFromGithubRequest } from './IGetFileContentFromGithubRequest';

export class GetFileContentFromGithubResponse {
  public readonly repositoryName: string;
  public readonly author: string;
  public readonly content: string;

  private constructor(repositoryName: string, author: string, content: string) {
    this.repositoryName = repositoryName;
    this.author = author;
    this.content = content;
  }

  public static from(
    content: string,
    input: IGetFileContentFromGithubRequest
  ): GetFileContentFromGithubResponse {
    return new GetFileContentFromGithubResponse(
      input.repositoryName,
      input.author,
      content
    );
  }
}
