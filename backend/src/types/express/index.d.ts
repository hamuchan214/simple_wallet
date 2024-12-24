import { AuthenticatedUserData } from "../../models/authenticatedUser";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserData;
    }
  }
}

export {};
