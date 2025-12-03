import { TokenPayload } from '@tasks-collab/core/types';

declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
    }
  }
}
