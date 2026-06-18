'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNoteDate } from '@/lib/note-utils';
import type { Note } from '@/modules/notes/notes.types';

interface NoteDetailPanelProps {
  note: Note | null;
}

export function NoteDetailPanel({ note }: NoteDetailPanelProps) {
  if (!note) {
    return (
      <Card className="hidden h-full min-h-[420px] lg:flex lg:flex-col lg:items-center lg:justify-center">
        <CardContent className="text-center text-muted-foreground">
          <p className="font-medium">Select a note to view details</p>
          <p className="mt-2 text-sm">Your full note content will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-2xl">{note.title}</CardTitle>
          {note.isPinned ? <Badge variant="accent">Pinned</Badge> : null}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>Created: {formatNoteDate(note.createdAt)}</span>
          <span>Updated: {formatNoteDate(note.updatedAt)}</span>
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
      </CardHeader>
      <CardContent>
        <div
          className="note-content text-sm leading-7"
          dangerouslySetInnerHTML={{ __html: note.content || '<p>No content</p>' }}
        />
      </CardContent>
    </Card>
  );
}
