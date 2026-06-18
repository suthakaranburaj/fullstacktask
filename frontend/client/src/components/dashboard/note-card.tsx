'use client';

import { Pin, PinOff, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNoteDate, formatRelativeDate, getNotePreview } from '@/lib/note-utils';
import type { Note } from '@/modules/notes/notes.types';
import { cn } from '@/lib/utils';

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
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'border-primary ring-2 ring-primary/20'
      )}
      onClick={() => onSelect(note)}
    >
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-base">{note.title}</CardTitle>
          {note.isPinned ? <Badge variant="accent">Pinned</Badge> : null}
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">{getNotePreview(note)}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Updated {formatRelativeDate(note.updatedAt)}</span>
          <span>•</span>
          <span>{formatNoteDate(note.createdAt)}</span>
        </div>

        {note.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div
          className="flex flex-wrap gap-2"
          data-tour={showTourAnchor ? 'note-actions' : undefined}
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTogglePin(note)}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            {note.isPinned ? 'Unpin' : 'Pin'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(note)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(note)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
