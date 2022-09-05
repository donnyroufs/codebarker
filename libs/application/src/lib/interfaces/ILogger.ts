export interface ILogger {
  info(msg: string, ctx?: unknown): void;
  error(msg: string, ctx?: unknown): void;
  warn(msg: string): void;
  debug(msg: string): void;
}

export const LoggerToken = Symbol('logger-token');
