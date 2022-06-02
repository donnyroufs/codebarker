import { TestingFactory, ValidationException } from '@codebarker/shared';
import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import {
  ApplicationModule,
  GetFileContentFromGithubResponse,
  GetFileContentFromGithubUseCase,
  GithubApiToken,
  IGetFileContentFromGithubRequest,
  IGithubApi,
  ILogger,
  LoggerToken,
} from '../../../src';

describe('get file content from github', () => {
  const mockedGithubApi = mock<IGithubApi>();

  let container: Container;
  let sut: GetFileContentFromGithubUseCase;

  beforeAll(() => {
    const mockedLogger = mock<ILogger>();
    container = TestingFactory.createContainer(ApplicationModule);
    container.bind<IGithubApi>(GithubApiToken).toConstantValue(mockedGithubApi);
    container.bind(LoggerToken).toConstantValue(mockedLogger);
  });

  beforeEach(() => {
    mockReset(mockedGithubApi);

    sut = container.get(GetFileContentFromGithubUseCase);
  });

  test.each(inputData())(
    'throws a validation exception when the input is invalid',
    async (author, repoName, fileDir) => {
      const act = (): Promise<GetFileContentFromGithubResponse> =>
        sut.execute({ author, repositoryName: repoName, fileDir });

      expect(act).rejects.toThrowError(ValidationException);
    }
  );

  test('returns the requested content', async () => {
    const request: IGetFileContentFromGithubRequest = {
      author: 'author',
      fileDir: 'filedir',
      repositoryName: 'repositoryName',
    };
    const expectedResult: GetFileContentFromGithubResponse = {
      author: request.author,
      content: 'content', // TODO: Might need to create a VO
      repositoryName: request.repositoryName,
    };

    mockedGithubApi.getFileContents.mockResolvedValueOnce(
      expectedResult.content
    );

    const result = await sut.execute(request);

    expect(mockedGithubApi.getFileContents).toHaveBeenCalledWith(
      request.author,
      request.repositoryName,
      request.fileDir
    );
    expect(result).toEqual(expectedResult);
  });
});

function inputData(): any[] {
  return [
    [1, 'repoName', 'fileDir'],
    ['author', 1, 'fileDir'],
    ['author', 'repoName', 1],
  ];
}
