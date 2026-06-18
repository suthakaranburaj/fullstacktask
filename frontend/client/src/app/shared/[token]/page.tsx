'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiError } from '@/lib/api-error';
import { formatNoteDate } from '@/lib/note-utils';
import { fadeUp } from '@/lib/motion';
import { getSharedNoteByToken } from '@/modules/notes/notes.service';
import type { Note } from '@/modules/notes/notes.types';
import { routes } from '@/constants/routes';
import { useAuth } from '@/providers/auth-provider';

function SharedNoteContent() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  useEffect(() => {
    if (authLoading || !token) return;

    const loadSharedNote = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getSharedNoteByToken(token);
        setNote(data);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Unable to load this shared note.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSharedNote();
  }, [authLoading, token]);

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center hero-gradient">
        <p className="text-sm text-muted-foreground">Loading shared note...</p>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 hero-gradient px-4 text-center">
        <p className="text-lg font-semibold">Shared note unavailable</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {error || 'This note may have been deleted or link sharing was disabled.'}
        </p>
        <Button onClick={() => router.push(routes.dashboard)}>Go to dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.dashboard}>
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Badge variant="secondary" className="gap-1">
            <Share2 className="h-3.5 w-3.5" />
            Shared note
          </Badge>
        </div>

        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <Card className="overflow-hidden border-primary/10 shadow-lg">
            <CardHeader className="space-y-3 border-b bg-muted/20">
              <CardTitle className="text-3xl">{note.title}</CardTitle>
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
            <CardContent className="pt-6">
              <div
                className="note-content text-sm leading-7"
                dangerouslySetInnerHTML={{ __html: note.content || '<p>No content</p>' }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function SharedNotePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center hero-gradient">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ProtectedRoute>
        <SharedNoteContent />
      </ProtectedRoute>
    </Suspense>
  );
}
