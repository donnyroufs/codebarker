export class PrismaUrlParser {
  public static parse(url: string): string {
    const hasSchema = url.includes('?schema=');

    if (!hasSchema) {
      return url;
    }

    return this.removeSchemaAndReturnUrl(url);
  }

  private static removeSchemaAndReturnUrl(url: string): string {
    return url.split('?schema=')[0]!;
  }
}
