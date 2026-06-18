'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Note } from '@/modules/notes/notes.types';

interface DeleteNoteDialogProps {
  note: Note | null;
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteNoteDialog({
  note,
  open,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteNoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete note?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. &quot;{note?.title}&quot; will be permanently removed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void onConfirm()} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete note'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
