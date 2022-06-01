import { Logtail } from '@logtail/node';
import { injectable } from 'inversify';

import { ILogger } from '@codebarker/application';

@injectable()
export class LoggerLogTailImpl implements ILogger {
  private readonly _logTail = new Logtail(process.env.SOURCE_TOKEN!);

  public debug(msg: string): void {
    this._logTail.debug(msg);
  }

  public warn(msg: string): void {
    this._logTail.warn(msg);
  }

  public info(msg: string): void {
    this._logTail.info(msg);
  }

  public error(msg: string): void {
    this._logTail.error(msg);
  }
}
