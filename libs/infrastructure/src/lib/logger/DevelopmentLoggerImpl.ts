import { injectable } from 'inversify';

import { ILogger } from '@codebarker/application';

@injectable()
export class DevelopmentLoggerImpl implements ILogger {
  public debug(msg: string): void {
    console.debug(msg);
  }

  public warn(msg: string): void {
    console.warn(msg);
  }

  public info(msg: string): void {
    console.info(msg);
  }

  public error(msg: string, ctx: Record<string, unknown> = {}): void {
    console.error({
      msg,
      ctx,
    });
  }
}
