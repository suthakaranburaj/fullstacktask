'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTour } from '@reactour/tour';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardTourProvider } from '@/components/dashboard/dashboard-tour';
import { DeleteNoteDialog } from '@/components/dashboard/delete-note-dialog';
import { NoteCard } from '@/components/dashboard/note-card';
import { NoteDetailPanel } from '@/components/dashboard/note-detail-panel';
import { NoteFormDialog } from '@/components/dashboard/note-form-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api-error';
import {
  createNote,
  deleteNote,
  getAllNotes,
  togglePinNote,
  updateNote,
} from '@/modules/notes/notes.service';
import type { CreateNoteInput, Note, UpdateNoteInput } from '@/modules/notes/notes.types';

function DashboardBody() {
  const { setIsOpen } = useTour();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const loadNotes = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getAllNotes(query ? { search: query } : undefined);
      setNotes(data);
      setSelectedNote((current) => {
        if (!current) return null;
        return data.find((note) => note.id === current.id) ?? null;
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load notes.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    void loadNotes(debouncedSearch);
  }, [debouncedSearch, loadNotes]);

  const openCreateDialog = () => {
    setFormMode('create');
    setEditingNote(null);
    setFormOpen(true);
  };

  const openEditDialog = (note: Note) => {
    setFormMode('edit');
    setEditingNote(note);
    setFormOpen(true);
  };

  const openDeleteDialog = (note: Note) => {
    setNoteToDelete(note);
    setDeleteOpen(true);
  };

  const handleCreateOrUpdate = async (payload: CreateNoteInput | UpdateNoteInput) => {
    setIsSaving(true);
    setError('');

    try {
      if (formMode === 'create') {
        const created = await createNote(payload as CreateNoteInput);
        setNotes((prev) => [created, ...prev]);
        setSelectedNote(created);
      } else if (editingNote) {
        const updated = await updateNote(editingNote.id, payload);
        setNotes((prev) => prev.map((note) => (note.id === updated.id ? updated : note)));
        setSelectedNote(updated);
      }

      setFormOpen(false);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to save note.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;

    setIsDeleting(true);
    setError('');

    try {
      await deleteNote(noteToDelete.id);
      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete.id));
      setSelectedNote((current) => (current?.id === noteToDelete.id ? null : current));
      setDeleteOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete note.';
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async (note: Note) => {
    setError('');

    try {
      const updated = await togglePinNote(note);
      setNotes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedNote((current) => (current?.id === updated.id ? updated : current));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update pin status.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen hero-gradient">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md" data-tour="search-notes">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notes by title or content..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Replay tour
            </Button>
            <Button data-tour="create-note" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Create note
            </Button>
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section data-tour="notes-list" className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-40 animate-pulse rounded-xl border bg-card" />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-card p-10 text-center">
                <p className="font-medium">No notes yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {debouncedSearch
                    ? 'No notes match your search. Try a different keyword.'
                    : 'Create your first note to get started.'}
                </p>
                {!debouncedSearch ? (
                  <Button className="mt-4" onClick={openCreateDialog}>
                    <Plus className="h-4 w-4" />
                    Create your first note
                  </Button>
                ) : null}
              </div>
            ) : (
              notes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSelected={selectedNote?.id === note.id}
                  showTourAnchor={index === 0}
                  onSelect={setSelectedNote}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                  onTogglePin={handleTogglePin}
                />
              ))
            )}
          </section>

          <NoteDetailPanel note={selectedNote} />
        </div>
      </div>

      <NoteFormDialog
        open={formOpen}
        mode={formMode}
        note={editingNote}
        isSaving={isSaving}
        onOpenChange={setFormOpen}
        onSubmit={handleCreateOrUpdate}
      />

      <DeleteNoteDialog
        note={noteToDelete}
        open={deleteOpen}
        isDeleting={isDeleting}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export function DashboardContent() {
  return (
    <DashboardTourProvider>
      <DashboardBody />
    </DashboardTourProvider>
  );
}
