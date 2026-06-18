import crypto from 'crypto';
import { Types, isValidObjectId } from 'mongoose';
import { env } from '../../../config/env';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../constants/httpStatus';
import { Note } from '../../../models/Note';
import { User } from '../../../models/User';
import { INoteDocument } from '../../../models/types/note.types';
import { CollaboratorRole } from '../../../models/types/note.types';
import {
  LinkShareResponse,
  NoteResponse,
  ShareMetaResponse,
  ShareUsersBody,
} from './notes.types';

function generateShareToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

function buildShareUrl(token: string | null): string | null {
  if (!token) return null;
  return `${env.frontendUrl}/shared/${token}`;
}

function formatNote(note: INoteDocument, viewerId?: string): NoteResponse {
  const json = note.toJSON() as NoteResponse & { preview?: string };
  const isOwner = viewerId ? String(note.owner) === viewerId : false;

  return {
    id: json.id,
    title: json.title,
    content: json.content,
    preview: json.preview ?? '',
    isPinned: json.isPinned,
    tags: json.tags,
    createdAt: json.createdAt,
    updatedAt: json.updatedAt,
    ...(isOwner && {
      isLinkShareEnabled: note.isLinkShareEnabled,
      shareUrl: note.isLinkShareEnabled ? buildShareUrl(note.shareToken) : null,
    }),
  };
}

async function getOwnedNote(noteId: string, userId: string): Promise<INoteDocument> {
  if (!isValidObjectId(noteId)) {
    throw new AppError('Invalid note id', HttpStatus.BAD_REQUEST);
  }

  const note = await Note.findOne({
    _id: new Types.ObjectId(noteId),
    owner: new Types.ObjectId(userId),
  });

  if (!note) {
    throw new AppError('Note not found or you do not have permission to share it', HttpStatus.NOT_FOUND);
  }

  return note;
}

export async function getShareMeta(noteId: string, userId: string): Promise<ShareMetaResponse> {
  const note = await getOwnedNote(noteId, userId);
  const collaboratorIds = note.collaborators.map((item) => item.user);

  const users = collaboratorIds.length
    ? await User.find({ _id: { $in: collaboratorIds } })
    : [];

  const userMap = new Map(users.map((user) => [user.id, user]));

  return {
    isLinkShareEnabled: note.isLinkShareEnabled,
    shareUrl: note.isLinkShareEnabled ? buildShareUrl(note.shareToken) : null,
    collaborators: note.collaborators.map((collaborator) => {
      const user = userMap.get(String(collaborator.user));
      return {
        email: user?.email ?? 'unknown',
        name: user?.name ?? '',
        role: collaborator.role,
      };
    }),
  };
}

export async function shareNoteWithUsers(
  noteId: string,
  userId: string,
  body: ShareUsersBody
): Promise<ShareMetaResponse> {
  const note = await getOwnedNote(noteId, userId);

  if (!body.emails?.length) {
    throw new AppError('At least one email is required', HttpStatus.BAD_REQUEST);
  }

  const role: CollaboratorRole = body.role ?? 'viewer';
  const normalizedEmails = [...new Set(body.emails.map((email) => email.trim().toLowerCase()))];
  const notFoundEmails: string[] = [];

  for (const email of normalizedEmails) {
    const user = await User.findOne({ email });

    if (!user) {
      notFoundEmails.push(email);
      continue;
    }

    if (user.id === userId) {
      continue;
    }

    const alreadyShared = note.collaborators.some(
      (collaborator) => String(collaborator.user) === user.id
    );

    if (!alreadyShared) {
      note.collaborators.push({
        user: new Types.ObjectId(user.id),
        role,
        addedAt: new Date(),
      });
    }
  }

  if (notFoundEmails.length > 0) {
    throw new AppError(
      `No registered users found for: ${notFoundEmails.join(', ')}`,
      HttpStatus.NOT_FOUND,
      { emails: notFoundEmails }
    );
  }

  await note.save();
  return getShareMeta(noteId, userId);
}

export async function toggleLinkShare(
  noteId: string,
  userId: string,
  enabled: boolean
): Promise<LinkShareResponse> {
  const note = await getOwnedNote(noteId, userId);

  if (enabled) {
    if (!note.shareToken) {
      note.shareToken = generateShareToken();
    }
    note.isLinkShareEnabled = true;
  } else {
    note.isLinkShareEnabled = false;
  }

  await note.save();

  return {
    isLinkShareEnabled: note.isLinkShareEnabled,
    shareUrl: note.isLinkShareEnabled ? buildShareUrl(note.shareToken) : null,
    shareToken: note.isLinkShareEnabled ? note.shareToken : null,
  };
}

export async function getSharedNoteByToken(
  token: string,
  userId: string
): Promise<NoteResponse> {
  if (!token?.trim()) {
    throw new AppError('Share token is required', HttpStatus.BAD_REQUEST);
  }

  const note = await Note.findOne({
    shareToken: token.trim(),
    isLinkShareEnabled: true,
  });

  if (!note) {
    throw new AppError('Shared note not found or link sharing is disabled', HttpStatus.NOT_FOUND);
  }

  const isOwner = String(note.owner) === userId;
  const isCollaborator = note.collaborators.some(
    (collaborator) => String(collaborator.user) === userId
  );

  if (!isOwner && !isCollaborator) {
    // Link-based access for any authenticated user when link sharing is enabled.
    return formatNote(note);
  }

  return formatNote(note, userId);
}

export { formatNote };
