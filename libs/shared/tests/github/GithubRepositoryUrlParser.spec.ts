import { GithubRepositoryUrlParser } from '../../src/lib/github/GithubRepositoryUrlParser';

describe('Github Repository Url Parser', () => {
  test('Parses a valid github link to a source file', () => {
    const expectedResult = {
      author: 'stemmlerjs',
      repositoryName: 'ddd-forum',
      fileDir:
        '/src/modules/forum/repos/implementations/sequelizeCommentVotesRepo.ts',
      sha: 'master',
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
      sha: undefined,
    };

    const result = GithubRepositoryUrlParser.parse(
      'src/modules/forum/repos/implementations/sequelizeCommentVotesRepo.ts'
    );

    expect(result).toEqual(expectedResult);
  });

  test('gets the file extension when there is only one dot', () => {
    const expectedResult = 'ts';
    const fileDir = '/app/core/main.ts';

    const result = GithubRepositoryUrlParser.getFileExtension(fileDir);

    expect(result).toEqual(expectedResult);
  });

  test('gets the file extension when there are multiple dots', () => {
    const expectedResult = 'ts';
    const fileDir = '/app/core/app.controller.ts';

    const result = GithubRepositoryUrlParser.getFileExtension(fileDir);

    expect(result).toEqual(expectedResult);
  });
});
