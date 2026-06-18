import { Types, isValidObjectId } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../constants/httpStatus';
import { Note } from '../../../models/Note';
import { INoteDocument } from '../../../models/types/note.types';
import { CreateNoteBody, NoteQuery, NoteResponse, UpdateNoteBody } from './notes.types';

function formatNote(note: INoteDocument): NoteResponse {
  const json = note.toJSON() as NoteResponse & { preview?: string };
  return {
    id: json.id,
    title: json.title,
    content: json.content,
    preview: json.preview ?? '',
    isPinned: json.isPinned,
    tags: json.tags,
    createdAt: json.createdAt,
    updatedAt: json.updatedAt,
  };
}

function buildAccessFilter(userId: string) {
  return {
    $or: [
      { owner: new Types.ObjectId(userId) },
      { 'collaborators.user': new Types.ObjectId(userId) },
    ],
  };
}

function validateNoteId(noteId: string): void {
  if (!isValidObjectId(noteId)) {
    throw new AppError('Invalid note id', HttpStatus.BAD_REQUEST);
  }
}

function validateTitle(title: unknown): string {
  if (typeof title !== 'string' || !title.trim()) {
    throw new AppError('Title must not be empty', HttpStatus.BAD_REQUEST);
  }

  return title.trim();
}

export async function createNote(userId: string, body: CreateNoteBody): Promise<NoteResponse> {
  const title = validateTitle(body.title);

  const note = await Note.create({
    owner: new Types.ObjectId(userId),
    title,
    content: body.content?.trim() ?? '',
    tags: body.tags ?? [],
    isPinned: body.isPinned ?? false,
  });

  return formatNote(note);
}

export async function getNotes(userId: string, query: NoteQuery): Promise<NoteResponse[]> {
  const accessFilter = buildAccessFilter(userId);
  let filter: Record<string, unknown> = accessFilter;

  if (query.search?.trim()) {
    const searchTerm = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    filter = {
      $and: [
        accessFilter,
        {
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { content: { $regex: searchTerm, $options: 'i' } },
          ],
        },
      ],
    };
  }

  const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });

  return notes.map(formatNote);
}

export async function getNoteById(userId: string, noteId: string): Promise<NoteResponse> {
  validateNoteId(noteId);

  const note = await Note.findOne({
    _id: new Types.ObjectId(noteId),
    ...buildAccessFilter(userId),
  });

  if (!note) {
    throw new AppError('Note not found', HttpStatus.NOT_FOUND);
  }

  return formatNote(note);
}

export async function updateNote(
  userId: string,
  noteId: string,
  body: UpdateNoteBody
): Promise<NoteResponse> {
  validateNoteId(noteId);

  const note = await Note.findOne({
    _id: new Types.ObjectId(noteId),
    owner: new Types.ObjectId(userId),
  });

  if (!note) {
    throw new AppError('Note not found or you do not have permission to edit it', HttpStatus.NOT_FOUND);
  }

  if (body.title !== undefined) {
    note.title = validateTitle(body.title);
  }

  if (body.content !== undefined) {
    note.content = body.content.trim();
  }

  if (body.tags !== undefined) {
    note.tags = body.tags;
  }

  if (body.isPinned !== undefined) {
    note.isPinned = body.isPinned;
  }

  await note.save();

  return formatNote(note);
}

export async function deleteNote(userId: string, noteId: string): Promise<void> {
  validateNoteId(noteId);

  const note = await Note.findOneAndDelete({
    _id: new Types.ObjectId(noteId),
    owner: new Types.ObjectId(userId),
  });

  if (!note) {
    throw new AppError('Note not found or you do not have permission to delete it', HttpStatus.NOT_FOUND);
  }
}
