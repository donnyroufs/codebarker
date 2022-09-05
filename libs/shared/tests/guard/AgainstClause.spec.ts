import { InvalidArgumentException } from '../../src/lib/exceptions';
import { AgainstClause } from '../../src/lib/guard';

describe('against clause ', () => {
  let sut!: AgainstClause;

  beforeAll(() => {
    sut = new AgainstClause();
  });

  describe('nullOrWhiteSpace', () => {
    test.each([['hi', 'world', ' hello!', 'amazing life story']])(
      'does not throw when valid',
      (str) => {
        const result = sut.nullOrWhiteSpace('str', str);

        expect(result).toBe(str);
      }
    );

    test.each([[' ', null, undefined, '    ', false, true, {}]])(
      'throws an ArgumentException when invalid',
      (str) => {
        const result = (): string => sut.nullOrWhiteSpace('str', str);

        expect(result).toThrowError(InvalidArgumentException);
      }
    );
  });
});
