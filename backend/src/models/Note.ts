import { Schema, model } from 'mongoose';
import {
  COLLABORATOR_ROLES,
  INoteDocument,
} from './types/note.types';

const collaboratorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: COLLABORATOR_ROLES,
      default: 'editor',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const noteSchema = new Schema<INoteDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Note owner is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      validate: {
        validator(value: string) {
          return value.length > 0;
        },
        message: 'Title must not be empty',
      },
    },
    content: {
      type: String,
      trim: true,
      default: '',
      maxlength: [50000, 'Content cannot exceed 50000 characters'],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(tags: string[]) {
          return tags.length <= 20;
        },
        message: 'A note cannot have more than 20 tags',
      },
    },
    collaborators: {
      type: [collaboratorSchema],
      default: [],
    },
    shareToken: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
      index: true,
    },
    isLinkShareEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

noteSchema.index({ owner: 1, updatedAt: -1 });
noteSchema.index({ owner: 1, isPinned: -1, updatedAt: -1 });
noteSchema.index({ 'collaborators.user': 1, updatedAt: -1 });
noteSchema.index({ title: 'text', content: 'text' });

noteSchema.virtual('preview').get(function getPreview(this: INoteDocument) {
  const maxLength = 150;
  if (!this.content) {
    return '';
  }
  return this.content.length <= maxLength
    ? this.content
    : `${this.content.slice(0, maxLength).trim()}...`;
});

noteSchema.set('toJSON', { virtuals: true });

export const Note = model<INoteDocument>('Note', noteSchema);
