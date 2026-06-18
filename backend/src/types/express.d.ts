import { IUserDocument } from '../../models/types/user.types';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUserDocument, 'id'>;
    }
  }
}

export {};
