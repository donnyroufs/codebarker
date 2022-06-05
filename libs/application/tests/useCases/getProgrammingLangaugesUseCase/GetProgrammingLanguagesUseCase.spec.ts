import { Container } from 'inversify';
import { mock, mockReset } from 'jest-mock-extended';

import { IKataRepository, KataRepositoryToken } from '@codebarker/domain';
import { TestingFactory } from '@codebarker/shared';

import {
  ApplicationModule,
  GetProgrammingLanguagesResponse,
  GetProgrammingLanguagesUseCase,
  ILogger,
  LoggerToken,
} from '../../../src';
import { ProgrammingLanguageFactory } from '../../utils';

describe('get programming languages', () => {
  const mockedRepo = mock<IKataRepository>();

  let container: Container;
  let sut: GetProgrammingLanguagesUseCase;

  beforeAll(() => {
    const mockedLogger = mock<ILogger>();
    container = TestingFactory.createContainer(ApplicationModule);
    container
      .bind<IKataRepository>(KataRepositoryToken)
      .toConstantValue(mockedRepo);
    container.bind(LoggerToken).toConstantValue(mockedLogger);
  });

  beforeEach(() => {
    mockReset(mockedRepo);

    sut = container.get(GetProgrammingLanguagesUseCase);
  });

  test('returns all programming langauges', async () => {
    const repoData = [ProgrammingLanguageFactory.make()];
    const expectedResult = GetProgrammingLanguagesResponse.from(repoData);

    mockedRepo.getProgrammingLanguagesAsync.mockResolvedValueOnce(repoData);

    const result = await sut.execute();

    expect(result).toEqual(expectedResult);
  });
});
