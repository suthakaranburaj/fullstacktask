'use client';

import { useEffect, useState } from 'react';
import { Copy, Link2, Users } from 'lucide-react';
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
import { ApiError } from '@/lib/api-error';
import {
  getShareMeta,
  shareNoteWithUsers,
  toggleLinkShare,
} from '@/modules/notes/notes.service';
import type { Note, ShareMeta } from '@/modules/notes/notes.types';

interface ShareNoteDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ShareTab = 'users' | 'link';

export function ShareNoteDialog({ note, open, onOpenChange }: ShareNoteDialogProps) {
  const [tab, setTab] = useState<ShareTab>('users');
  const [emailsInput, setEmailsInput] = useState('');
  const [meta, setMeta] = useState<ShareMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !note) return;

    const loadMeta = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getShareMeta(note.id);
        setMeta(data);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to load share settings.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMeta();
  }, [open, note]);

  const handleShareUsers = async () => {
    if (!note) return;

    const emails = emailsInput
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    if (!emails.length) {
      setError('Enter at least one email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = await shareNoteWithUsers(note.id, { emails, role: 'viewer' });
      setMeta(data);
      setEmailsInput('');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to share note.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLink = async (enabled: boolean) => {
    if (!note) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await toggleLinkShare(note.id, enabled);
      setMeta((current) => ({
        isLinkShareEnabled: result.isLinkShareEnabled,
        shareUrl: result.shareUrl,
        collaborators: current?.collaborators ?? [],
      }));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update link sharing.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!meta?.shareUrl) return;

    await navigator.clipboard.writeText(meta.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share note</DialogTitle>
          <DialogDescription>
            Invite specific users or share a link. Anyone opening the link must sign in first.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 rounded-lg bg-muted/50 p-1">
          <Button
            type="button"
            variant={tab === 'users' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setTab('users')}
          >
            <Users className="h-4 w-4" />
            Select users
          </Button>
          <Button
            type="button"
            variant={tab === 'link' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setTab('link')}
          >
            <Link2 className="h-4 w-4" />
            Anyone with link
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading share settings...</p>
        ) : null}

        {tab === 'users' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="share-emails">User emails (comma separated)</Label>
              <Input
                id="share-emails"
                value={emailsInput}
                onChange={(event) => setEmailsInput(event.target.value)}
                placeholder="friend@email.com, teammate@email.com"
              />
              <p className="text-xs text-muted-foreground">
                Users must already have a NoteNest account with Google sign-in.
              </p>
            </div>

            <Button onClick={() => void handleShareUsers()} disabled={isSubmitting}>
              {isSubmitting ? 'Sharing...' : 'Share with users'}
            </Button>

            {meta?.collaborators.length ? (
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Shared with
                </p>
                <ul className="space-y-1 text-sm">
                  {meta.collaborators.map((collaborator) => (
                    <li key={collaborator.email}>
                      {collaborator.name || collaborator.email}{' '}
                      <span className="text-muted-foreground">({collaborator.role})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              When enabled, anyone with the link can view this note after logging in with Google.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={meta?.isLinkShareEnabled ? 'outline' : 'default'}
                onClick={() => void handleToggleLink(!meta?.isLinkShareEnabled)}
                disabled={isSubmitting}
              >
                {meta?.isLinkShareEnabled ? 'Disable link' : 'Enable link sharing'}
              </Button>

              {meta?.isLinkShareEnabled && meta.shareUrl ? (
                <Button variant="outline" onClick={() => void handleCopyLink()}>
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy link'}
                </Button>
              ) : null}
            </div>

            {meta?.isLinkShareEnabled && meta.shareUrl ? (
              <div className="rounded-lg border bg-muted/20 p-3 text-xs break-all text-muted-foreground">
                {meta.shareUrl}
              </div>
            ) : null}
          </div>
        )}

        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
