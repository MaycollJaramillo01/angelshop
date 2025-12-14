import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';

declare module 'morgan' {
  type FormatFn = (
    tokens: Record<string, unknown>,
    req: Request,
    res: Response
  ) => string;
  type Format = string | FormatFn;

  interface Options {
    immediate?: boolean;
    stream?: NodeJS.WritableStream;
    skip?(req: Request, res: Response): boolean;
  }

  function morgan(format?: Format, options?: Options): RequestHandler;

  namespace morgan {
    function token(
      name: string,
      callback: (req: Request, res: Response) => string
    ): void;
    function compile(format: string): FormatFn;
  }

  export = morgan;
}
