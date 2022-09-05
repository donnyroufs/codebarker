import { inject, injectable } from 'inversify';

import { ILogger, LoggerToken } from '@codebarker/application';
import { cast, NullOr } from '@codebarker/shared';

type Configuration = {
  NODE_ENV: 'development' | 'production' | 'staging' | 'test';
  DATABASE_URL: string;
};

@injectable()
export class ConfigService {
  private readonly _logger: ILogger;

  public constructor(@inject(LoggerToken) logger: ILogger) {
    this._logger = logger;
  }

  public isDevelopment(): boolean {
    return this.getEnvironment() === 'development';
  }

  public isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }

  public isStaging(): boolean {
    return this.getEnvironment() === 'staging';
  }

  public isTest(): boolean {
    return this.getEnvironment() === 'test';
  }

  public get<
    TKey extends keyof Configuration,
    TValue extends Configuration[TKey]
  >(key: TKey): NullOr<TValue> {
    const value = cast<Configuration>(process.env)[key] as NullOr<TValue>;

    if (!value) {
      this._logger.error(`Missing environment variable for the key: '${key}'`);
    }

    return value;
  }

  private getEnvironment(): Configuration['NODE_ENV'] {
    const env = this.get('NODE_ENV');

    if (!env) {
      return 'development';
    }

    return env;
  }
}
