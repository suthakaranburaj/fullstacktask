import { format, formatDistanceToNow } from 'date-fns';
import type { Note } from '@/modules/notes/notes.types';

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function getNotePreview(note: Note): string {
  const plain = stripHtml(note.content);
  if (plain) return plain.length > 150 ? `${plain.slice(0, 150)}...` : plain;
  return note.preview || 'No content yet';
}

export function formatNoteDate(value: string): string {
  return format(new Date(value), 'MMM d, yyyy • h:mm a');
}

export function formatRelativeDate(value: string): string {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function parseTagsInput(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function tagsToInput(tags: string[]): string {
  return tags.join(', ');
}

export function validateNoteTitle(title: string): string | null {
  if (!title.trim()) {
    return 'Title must not be empty';
  }
  return null;
}
