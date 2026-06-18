'use client';

import { motion } from 'framer-motion';
import { Pin, PinOff, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Note } from '@/modules/notes/notes.types';
import { cn } from '@/lib/utils';
import { fadeUp } from '@/lib/motion';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  showTourAnchor?: boolean;
  onSelect: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (note: Note) => void;
}

export function NoteCard({
  note,
  isSelected,
  showTourAnchor = false,
  onSelect,
  onEdit,
  onDelete,
  onTogglePin,
}: NoteCardProps) {
  return (
    <motion.article
      layout
      variants={fadeUp}
      transition={{ duration: 0.3 }}
      className={cn(
        'group flex items-center gap-3 rounded-xl border bg-card/80 px-3 py-2.5 shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md',
        isSelected && 'border-primary bg-primary/5 ring-2 ring-primary/20'
      )}
      onClick={() => onSelect(note)}
    >
      <div className="flex w-5 shrink-0 justify-center">
        {note.isPinned ? (
          <Pin className="h-4 w-4 fill-accent text-accent" aria-label="Pinned" />
        ) : (
          <Pin className="h-4 w-4 text-muted-foreground/30" aria-hidden />
        )}
      </div>

      <h3 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">{note.title}</h3>

      <div
        className="flex shrink-0 items-center gap-0.5 opacity-80 transition-opacity group-hover:opacity-100"
        data-tour={showTourAnchor ? 'note-actions' : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onTogglePin(note)}
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(note)}
          aria-label="Edit note"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(note)}
          aria-label="Delete note"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.article>
  );
}
