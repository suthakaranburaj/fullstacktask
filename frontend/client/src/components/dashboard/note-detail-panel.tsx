'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNoteDate } from '@/lib/note-utils';
import { fadeUp, scaleIn } from '@/lib/motion';
import type { Note } from '@/modules/notes/notes.types';

interface NoteDetailPanelProps {
  note: Note | null;
}

export function NoteDetailPanel({ note }: NoteDetailPanelProps) {
  return (
    <Card className="sticky top-20 hidden min-h-[520px] overflow-hidden border-primary/10 bg-card/90 shadow-lg backdrop-blur-sm lg:block">
      <AnimatePresence mode="wait">
        {!note ? (
          <motion.div
            key="empty"
            {...scaleIn}
            transition={{ duration: 0.35 }}
            className="flex h-full min-h-[520px] flex-col items-center justify-center p-8 text-center"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-7 w-7" />
            </div>
            <p className="font-medium">Select a note to view details</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Your full note content, tags, and timestamps will appear here.
            </p>
          </motion.div>
        ) : (
          <motion.div key={note.id} {...fadeUp} transition={{ duration: 0.35 }}>
            <CardHeader className="space-y-4 border-b bg-muted/20 pb-5">
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
            <CardContent className="max-h-[calc(100vh-280px)] overflow-y-auto pt-6">
              <div
                className="note-content text-sm leading-7"
                dangerouslySetInnerHTML={{ __html: note.content || '<p>No content</p>' }}
              />
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
