import { mockDeep, mockReset } from 'jest-mock-extended';

import { IKataRepository, KataRepositoryToken } from '@codebarker/domain';
import { TestingFactory } from '@codebarker/shared';
import { PrismaService } from '../../../../src/lib/drivers/prisma/PrismaService';
import { InfrastructureModule } from '../../../../src/lib/InfrastructureModule';

describe('prisma kata repository impl', () => {
  const mockedPrismaService = mockDeep<PrismaService>();
  let sut: IKataRepository;

  beforeAll(async () => {
    const container = TestingFactory.createContainer(InfrastructureModule);

    container.rebind(PrismaService).toConstantValue(mockedPrismaService);
    sut = container.get<IKataRepository>(KataRepositoryToken);

    mockReset(mockedPrismaService);
  });

  test('generates a random id', () => {
    const first = sut.generateId();
    const second = sut.generateId();

    expect(first).not.toBe(second);
  });
});
