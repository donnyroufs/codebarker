import { PrismaUrlParser } from './PrismaUrlParser';

describe('prisma url parser', () => {
  test('removes schema from url and replaces it with given schema', () => {
    const parsedUrl = PrismaUrlParser.parse(UrlFactory.withSchema());

    expect(parsedUrl).toBe(
      'postgresql://postgres:postgres@localhost:5432/codebarker'
    );
  });

  test('does nothing and returns the url', () => {
    const parsedUrl = PrismaUrlParser.parse(UrlFactory.withoutSchema());

    expect(parsedUrl).toBe(
      'postgresql://postgres:postgres@localhost:5432/codebarker'
    );
  });
});

class UrlFactory {
  public static withoutSchema(): string {
    return 'postgresql://postgres:postgres@localhost:5432/codebarker';
  }

  public static withSchema(schema = 'public'): string {
    return (
      'postgresql://postgres:postgres@localhost:5432/codebarker?schema=' +
      schema
    );
  }
}
