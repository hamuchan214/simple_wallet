import { AuthorizedUser } from "../../models/authorized";

declare global {
  namespace Express {
    interface Request {
      user?: AuthorizedUser;
    }
  }
}

export {};
