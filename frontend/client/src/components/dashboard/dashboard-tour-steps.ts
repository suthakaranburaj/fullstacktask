import type { StepType } from '@reactour/tour';

export const dashboardTourSteps: StepType[] = [
  {
    selector: '[data-tour="dashboard-welcome"]',
    content: 'Welcome to your NoteNest dashboard! This quick tour will show you around.',
  },
  {
    selector: '[data-tour="search-notes"]',
    content: 'Search notes with debounce — results update shortly after you stop typing.',
  },
  {
    selector: '[data-tour="tag-filter"]',
    content: 'Filter notes by badge tags to focus on a specific category.',
  },
  {
    selector: '[data-tour="create-note"]',
    content: 'Create a new note with rich text styling, tags, and pin support.',
  },
  {
    selector: '[data-tour="notes-list"]',
    content: 'Your notes appear here sorted by most recently updated. Pinned notes stay on top.',
  },
  {
    selector: '[data-tour="note-actions"]',
    content: 'Pin, edit, or delete any note. Click a card to view full details.',
  },
  {
    selector: '[data-tour="user-menu"]',
    content: 'Switch theme or sign out anytime from here. Happy note-taking!',
  },
];
