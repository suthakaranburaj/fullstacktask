import { Schema, model } from 'mongoose';
import {
  AUTH_TOKEN_TYPES,
  IAuthTokenDocument,
} from './types/authToken.types';

const authTokenSchema = new Schema<IAuthTokenDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    tokenHash: {
      type: String,
      required: [true, 'Token hash is required'],
      select: false,
    },
    type: {
      type: String,
      enum: AUTH_TOKEN_TYPES,
      required: [true, 'Token type is required'],
      index: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        delete ret.tokenHash;
        return ret;
      },
    },
  }
);

authTokenSchema.index({ user: 1, type: 1, isRevoked: 1 });
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AuthToken = model<IAuthTokenDocument>('AuthToken', authTokenSchema);
