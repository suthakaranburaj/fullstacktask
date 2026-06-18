import { Request, Response } from 'express';
import { asyncHandler, respond } from '../../../utils';
import * as notesService from './notes.service';
import { CreateNoteBody, NoteQuery, UpdateNoteBody } from './notes.types';

function getRouteParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

export const createNote = asyncHandler(async (req: Request, res: Response) => {
  const note = await notesService.createNote(req.user!.id, req.body as CreateNoteBody);

  return respond.created(res, 'Note created successfully', note);
});

export const getNotes = asyncHandler(async (req: Request, res: Response) => {
  const notes = await notesService.getNotes(req.user!.id, req.query as NoteQuery);

  return respond.success({
    res,
    message: notes.length ? 'Notes fetched successfully' : 'No notes found',
    data: notes,
  });
});

export const getNoteById = asyncHandler(async (req: Request, res: Response) => {
  const note = await notesService.getNoteById(req.user!.id, getRouteParam(req.params.id));

  return respond.success({
    res,
    message: 'Note fetched successfully',
    data: note,
  });
});

export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const note = await notesService.updateNote(
    req.user!.id,
    getRouteParam(req.params.id),
    req.body as UpdateNoteBody
  );

  return respond.success({
    res,
    message: 'Note updated successfully',
    data: note,
  });
});

export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  await notesService.deleteNote(req.user!.id, getRouteParam(req.params.id));

  return respond.success({
    res,
    message: 'Note deleted successfully',
    data: null,
  });
});
