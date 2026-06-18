export interface Note {
  id: string;
  title: string;
  content: string;
  preview: string;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isLinkShareEnabled?: boolean;
  shareUrl?: string | null;
}

export interface ShareCollaborator {
  email: string;
  name: string;
  role: string;
}

export interface ShareMeta {
  isLinkShareEnabled: boolean;
  shareUrl: string | null;
  collaborators: ShareCollaborator[];
}

export interface LinkShareResult {
  isLinkShareEnabled: boolean;
  shareUrl: string | null;
  shareToken: string | null;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface NotesQuery {
  search?: string;
}
