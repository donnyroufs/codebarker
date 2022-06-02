import { Content } from '@codebarker/domain';

import { ContentDto } from '../../dtos/ContentDto';
import { IGetFileContentFromGithubRequest } from './IGetFileContentFromGithubRequest';

export class GetFileContentFromGithubResponse {
  public readonly repositoryName: string;
  public readonly author: string;
  public readonly content: ContentDto;

  private constructor(
    repositoryName: string,
    author: string,
    content: ContentDto
  ) {
    this.repositoryName = repositoryName;
    this.author = author;
    this.content = content;
  }

  public static from(
    content: Content,
    input: IGetFileContentFromGithubRequest
  ): GetFileContentFromGithubResponse {
    return new GetFileContentFromGithubResponse(
      input.repositoryName,
      input.author,
      ContentDto.from(content)
    );
  }
}
