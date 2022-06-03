import { GithubRepositoryUrlParser } from './GithubRepositoryUrlParser';

describe('Github Repository Url Parser', () => {
  test('Parses a valid github link to a source file', () => {
    const expectedResult = {
      author: 'stemmlerjs',
      repositoryName: 'ddd-forum',
      fileDir:
        '/src/modules/forum/repos/implementations/sequelizeCommentVotesRepo.ts',
    };

    const result = GithubRepositoryUrlParser.parse(
      'https://github.com/stemmlerjs/ddd-forum/blob/master/src/modules/forum/repos/implementations/sequelizeCommentVotesRepo.ts'
    );

    expect(result).toEqual(expectedResult);
  });

  test('returns undefined values when invalid blob url', () => {
    const expectedResult = {
      author: undefined,
      repositoryName: undefined,
      fileDir: undefined,
    };

    const result = GithubRepositoryUrlParser.parse(
      'src/modules/forum/repos/implementations/sequelizeCommentVotesRepo.ts'
    );

    expect(result).toEqual(expectedResult);
  });
});
