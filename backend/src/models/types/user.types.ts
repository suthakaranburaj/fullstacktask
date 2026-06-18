import { Document } from 'mongoose';

export interface IUser {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  id: string;
}
