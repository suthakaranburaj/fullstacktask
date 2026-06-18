import { Document, Types } from 'mongoose';

export const COLLABORATOR_ROLES = ['viewer', 'editor'] as const;

export type CollaboratorRole = (typeof COLLABORATOR_ROLES)[number];

export interface ICollaborator {
  user: Types.ObjectId;
  role: CollaboratorRole;
  addedAt: Date;
}

export interface INote {
  owner: Types.ObjectId;
  title: string;
  content: string;
  isPinned: boolean;
  tags: string[];
  collaborators: ICollaborator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface INoteDocument extends INote, Document {
  id: string;
  preview: string;
}
