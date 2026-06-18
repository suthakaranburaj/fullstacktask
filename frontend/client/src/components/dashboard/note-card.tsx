'use client';

import { motion } from 'framer-motion';
import { Pin, Pencil, Share2, Trash2 } from 'lucide-react';
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
  onShare: (note: Note) => void;
}

export function NoteCard({
  note,
  isSelected,
  showTourAnchor = false,
  onSelect,
  onEdit,
  onDelete,
  onTogglePin,
  onShare,
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
      <button
        type="button"
        className="flex w-4 shrink-0 justify-center rounded-sm transition-colors hover:bg-muted/60"
        onClick={(event) => {
          event.stopPropagation();
          onTogglePin(note);
        }}
        aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
      >
        {note.isPinned ? (
          <Pin className="h-3.5 w-3.5 fill-accent text-accent" />
        ) : (
          <Pin className="h-3.5 w-3.5 text-muted-foreground/40" />
        )}
      </button>

      <h3 className="min-w-0 flex-1 truncate text-sm font-medium leading-tight">{note.title}</h3>

      <div
        className="flex shrink-0 items-center gap-0.5 opacity-80 transition-opacity group-hover:opacity-100"
        data-tour={showTourAnchor ? 'note-actions' : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onShare(note)}
          aria-label="Share note"
        >
          <Share2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onEdit(note)}
          aria-label="Edit note"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(note)}
          aria-label="Delete note"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.article>
  );
}
