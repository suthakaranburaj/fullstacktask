'use client';

import { useEffect, useState } from 'react';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseTagsInput, tagsToInput, validateNoteTitle } from '@/lib/note-utils';
import type { CreateNoteInput, Note, UpdateNoteInput } from '@/modules/notes/notes.types';

interface NoteFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  note?: Note | null;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateNoteInput | UpdateNoteInput) => Promise<void>;
}

export function NoteFormDialog({
  open,
  mode,
  note,
  isSaving,
  onOpenChange,
  onSubmit,
}: NoteFormDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && note) {
      setTitle(note.title);
      setContent(note.content);
      setTagsInput(tagsToInput(note.tags));
      setIsPinned(note.isPinned);
    } else {
      setTitle('');
      setContent('');
      setTagsInput('');
      setIsPinned(false);
    }
    setError('');
  }, [open, mode, note]);

  const handleSubmit = async () => {
    const titleError = validateNoteTitle(title);
    if (titleError) {
      setError(titleError);
      return;
    }

    setError('');

    const payload = {
      title: title.trim(),
      content,
      tags: parseTagsInput(tagsInput),
      isPinned,
    };

    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create note' : 'Edit note'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a title and write your note with rich text styling.'
              : 'Update your note details below.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter note title"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your note here..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-tags">Tags (comma separated)</Label>
            <Input
              id="note-tags"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="work, ideas, personal"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(event) => setIsPinned(event.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Pin this note
          </label>

          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={() => void handleSubmit()} disabled={isSaving}>
              {isSaving ? 'Saving...' : mode === 'create' ? 'Create note' : 'Save changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
