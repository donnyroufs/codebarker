import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import * as path from 'path';
import { execSync } from 'child_process';

import { ConfigService } from './ConfigService';
import { PrismaUrlFactory } from './PrismaUrlFactory';

@injectable()
export class PrismaService extends PrismaClient {
  public constructor(url: string) {
    super({
      datasources: {
        db: {
          url,
        },
      },
    });
  }

  public static make(configService: ConfigService): PrismaService {
    const url = new PrismaUrlFactory(configService).make();

    if (configService.isTest()) {
      const prismaBinary = path.resolve('node_modules/.bin/prisma');

      execSync(`${prismaBinary} db push --skip-generate`, {
        env: {
          ...process.env,
          DATABASE_URL: url,
        } as any,
      });
    }

      execSync(`yarn db:seed`, {
        env: {
          ...process.env,
          DATABASE_URL: url,
        } as any,
      });

    return new PrismaService(url);
  }
}
