import * as crypto from 'crypto';
import { injectable } from 'inversify';

import { InfraException } from '../../InfraException';
import { ConfigService } from '../../ConfigService';
import { PrismaUrlParser } from './PrismaUrlParser';

@injectable()
export class PrismaUrlFactory {
  private readonly _configService: ConfigService;

  public constructor(configService: ConfigService) {
    this._configService = configService;
  }

  public make(): string {
    const databaseUrl = this._configService.get('DATABASE_URL');

    if (!databaseUrl) {
      throw new InfraException('Missing database url');
    }

    if (!this._configService.isTest()) {
      return databaseUrl;
    }

    return (
      PrismaUrlParser.parse(databaseUrl) + '?schema=' + crypto.randomUUID()
    );
  }
}
