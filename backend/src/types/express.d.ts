import type { JwtUser } from "../utils/token.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

declare module "express-serve-static-core" {
  interface ParamsDictionary {
    [key: string]: string;
  }
}
