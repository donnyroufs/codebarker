import { readFileSync } from 'fs';

export class FileReader {
  public static readSync(path: string): Buffer {
    return readFileSync(path);
  }
}
