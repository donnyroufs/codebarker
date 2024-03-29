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

  public info(msg: string, ctx: Record<string, unknown> = {}): void {
    console.info(this.createEntry(msg, ctx));
  }

  public error(msg: string, ctx: Record<string, unknown> = {}): void {
    console.error(this.createEntry(msg, ctx));
  }

  private createEntry(msg: string, ctx: unknown): any {
    return {
      msg,
      ctx: JSON.stringify(ctx, null, 2),
    };
  }
}
