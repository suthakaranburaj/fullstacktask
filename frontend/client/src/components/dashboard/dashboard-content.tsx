'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, Search, Sparkles } from 'lucide-react';
import { useTour } from '@reactour/tour';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardTourProvider } from '@/components/dashboard/dashboard-tour';
import { DeleteNoteDialog } from '@/components/dashboard/delete-note-dialog';
import { NoteCard } from '@/components/dashboard/note-card';
import { NoteDetailPanel } from '@/components/dashboard/note-detail-panel';
import { NoteFormDialog } from '@/components/dashboard/note-form-dialog';
import { ShareNoteDialog } from '@/components/dashboard/share-note-dialog';
import { TagFilterDropdown } from '@/components/dashboard/tag-filter-dropdown';
import { RenderColdStartNotice } from '@/components/common/render-cold-start-notice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useSlowLoadingNotice } from '@/hooks/use-slow-loading-notice';
import { ApiError } from '@/lib/api-error';
import { fadeUp, staggerContainer } from '@/lib/motion';
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
  const debouncedSearch = useDebounce(search, 400);
  const [selectedTag, setSelectedTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [noteToShare, setNoteToShare] = useState<Note | null>(null);
  const showSlowNotice = useSlowLoadingNotice(isLoading);

  const isSearching = search !== debouncedSearch;

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
    void loadNotes(debouncedSearch);
  }, [debouncedSearch, loadNotes]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((note) => note.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!selectedTag) return notes;
    return notes.filter((note) => note.tags.includes(selectedTag));
  }, [notes, selectedTag]);

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

  const openShareDialog = (note: Note) => {
    setNoteToShare(note);
    setShareOpen(true);
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
        <motion.div
          {...fadeUp}
          className="rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur-md sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-md" data-tour="search-notes">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search notes by title or content..."
                  className="bg-background/80 pl-9"
                />
                {isSearching ? (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                ) : null}
              </div>

              <TagFilterDropdown
                tags={availableTags}
                value={selectedTag}
                onChange={setSelectedTag}
                className="sm:max-w-[200px]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setIsOpen(true)}>
                <Sparkles className="h-4 w-4" />
                Replay tour
              </Button>
              <Button data-tour="create-note" onClick={openCreateDialog}>
                <Plus className="h-4 w-4" />
                Create note
              </Button>
            </div>
          </div>
        </motion.div>

        {error ? (
          <motion.p
            {...fadeUp}
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </motion.p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <section data-tour="notes-list" className="space-y-2">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-medium text-muted-foreground">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
              </p>
              {(debouncedSearch || selectedTag) && (
                <p className="text-xs text-muted-foreground">Filtered results</p>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <RenderColdStartNotice show={showSlowNotice} />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-10 animate-pulse rounded-lg border bg-card/60" />
                  ))}
                </div>
              </div>
            ) : filteredNotes.length === 0 ? (
              <motion.div
                {...fadeUp}
                className="rounded-xl border border-dashed bg-card/70 p-10 text-center backdrop-blur-sm"
              >
                <p className="font-medium">No notes found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {debouncedSearch || selectedTag
                    ? 'Try adjusting your search or badge filter.'
                    : 'Create your first note to get started.'}
                </p>
                {!debouncedSearch && !selectedTag ? (
                  <Button className="mt-4" onClick={openCreateDialog}>
                    <Plus className="h-4 w-4" />
                    Create your first note
                  </Button>
                ) : null}
              </motion.div>
            ) : (
              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
                {filteredNotes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isSelected={selectedNote?.id === note.id}
                    showTourAnchor={index === 0}
                    onSelect={setSelectedNote}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                  onTogglePin={handleTogglePin}
                  onShare={openShareDialog}
                />
                ))}
              </motion.div>
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

      <ShareNoteDialog note={noteToShare} open={shareOpen} onOpenChange={setShareOpen} />
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
