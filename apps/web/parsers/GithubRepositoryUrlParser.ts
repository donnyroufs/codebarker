export type ParsedGithubUrl = {
  author?: string;
  repositoryName?: string;
  fileDir?: string;
  sha?: string;
};
export class GithubRepositoryUrlParser {
  public static parse(url: string): ParsedGithubUrl {
    if (!this.isValidBlobUrl(url)) {
      return {
        author: undefined,
        repositoryName: undefined,
        fileDir: undefined,
      };
    }

    const arr = url.split('/');
    const index = arr.findIndex((el) => el.includes('blob'));

    const author = arr.at(index - 2)!;
    const repositoryName = arr.at(index - 1)!;
    const fileDir = arr.slice(index + 2, arr.length).join('/');
    const sha = arr.at(index + 1);

    return {
      author,
      repositoryName,
      fileDir: fileDir ? '/' + fileDir : undefined,
      sha,
    };
  }

  private static isValidBlobUrl(url: string): boolean {
    return url.includes('blob');
  }
}
