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
}
