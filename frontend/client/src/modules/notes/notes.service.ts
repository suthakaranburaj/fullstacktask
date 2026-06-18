import { apiClient } from '@/lib/api-client';
import type {
  CreateNoteInput,
  LinkShareResult,
  Note,
  NotesQuery,
  ShareMeta,
  UpdateNoteInput,
} from './notes.types';

function buildQueryString(query?: NotesQuery): string {
  if (!query?.search?.trim()) return '';
  return `?search=${encodeURIComponent(query.search.trim())}`;
}

export async function getAllNotes(query?: NotesQuery): Promise<Note[]> {
  const response = await apiClient<Note[]>(`/notes${buildQueryString(query)}`);
  return response.data;
}

export async function getNoteById(noteId: string): Promise<Note> {
  const response = await apiClient<Note>(`/notes/${noteId}`);
  return response.data;
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const response = await apiClient<Note>('/notes', {
    method: 'POST',
    body: input,
  });
  return response.data;
}

export async function updateNote(noteId: string, input: UpdateNoteInput): Promise<Note> {
  const response = await apiClient<Note>(`/notes/${noteId}`, {
    method: 'PUT',
    body: input,
  });
  return response.data;
}

export async function deleteNote(noteId: string): Promise<void> {
  await apiClient<null>(`/notes/${noteId}`, {
    method: 'DELETE',
  });
}

export async function togglePinNote(note: Note): Promise<Note> {
  return updateNote(note.id, { isPinned: !note.isPinned });
}

export async function getShareMeta(noteId: string): Promise<ShareMeta> {
  const response = await apiClient<ShareMeta>(`/notes/${noteId}/share`);
  return response.data;
}

export async function shareNoteWithUsers(
  noteId: string,
  body: { emails: string[]; role?: 'viewer' | 'editor' }
): Promise<ShareMeta> {
  const response = await apiClient<ShareMeta>(`/notes/${noteId}/share/users`, {
    method: 'POST',
    body,
  });
  return response.data;
}

export async function toggleLinkShare(noteId: string, enabled: boolean): Promise<LinkShareResult> {
  const response = await apiClient<LinkShareResult>(`/notes/${noteId}/share/link`, {
    method: 'POST',
    body: { enabled },
  });
  return response.data;
}

export async function getSharedNoteByToken(token: string): Promise<Note> {
  const response = await apiClient<Note>(`/notes/shared/${token}`);
  return response.data;
}
