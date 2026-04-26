import type { JwtUser } from "../utils/token.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

