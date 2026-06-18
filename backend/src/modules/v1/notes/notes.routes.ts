import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import * as notesController from './notes.controller';

const notesRouter = Router();

notesRouter.use(protect);

notesRouter.post('/', notesController.createNote);
notesRouter.get('/', notesController.getNotes);
notesRouter.get('/:id', notesController.getNoteById);
notesRouter.put('/:id', notesController.updateNote);
notesRouter.delete('/:id', notesController.deleteNote);

export default notesRouter;
