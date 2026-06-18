export interface CreateNoteBody {
  title: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface UpdateNoteBody {
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface NoteQuery {
  search?: string;
}

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  preview: string;
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isLinkShareEnabled?: boolean;
  shareUrl?: string | null;
}

export interface ShareUsersBody {
  emails: string[];
  role?: 'viewer' | 'editor';
}

export interface ToggleLinkShareBody {
  enabled: boolean;
}

export interface ShareMetaResponse {
  isLinkShareEnabled: boolean;
  shareUrl: string | null;
  collaborators: Array<{
    email: string;
    name: string;
    role: string;
  }>;
}

export interface LinkShareResponse {
  isLinkShareEnabled: boolean;
  shareUrl: string | null;
  shareToken: string | null;
}
