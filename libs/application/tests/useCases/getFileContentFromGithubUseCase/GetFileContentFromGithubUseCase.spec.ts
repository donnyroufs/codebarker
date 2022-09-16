import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import { TestingFactory } from '@codebarker/shared';

import {
  ApplicationModule,
  GetFileContentFromGithubResponse,
  GetFileContentFromGithubUseCase,
  GithubApiToken,
  IGetFileContentFromGithubRequest,
  IGithubApi,
  ILogger,
  LoggerToken,
  ContentDto,
} from '../../../src';
import { ContentFactory } from '../../utils/ContentFactory';

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

  test('returns the requested content', async () => {
    const request: IGetFileContentFromGithubRequest = {
      author: 'author',
      fileDir: 'filedir',
      repositoryName: 'repositoryName',
      sha: 'sha',
    };
    const content = ContentFactory.make();
    const expectedResult: GetFileContentFromGithubResponse = {
      author: request.author,
      content: ContentDto.from(content),
      repositoryName: request.repositoryName,
    };

    mockedGithubApi.getFileContents.mockResolvedValueOnce(content);

    const result = await sut.execute(request);

    expect(mockedGithubApi.getFileContents).toHaveBeenCalledWith(
      request.author,
      request.repositoryName,
      request.fileDir,
      request.sha
    );
    expect(result).toEqual(expectedResult);
  });
});
