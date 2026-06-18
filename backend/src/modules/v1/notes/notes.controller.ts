import { Request, Response } from 'express';
import { asyncHandler, respond } from '../../../utils';
import * as notesService from './notes.service';
import * as shareService from './notes.share.service';
import { CreateNoteBody, NoteQuery, ShareUsersBody, ToggleLinkShareBody, UpdateNoteBody } from './notes.types';

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

export const getSharedNote = asyncHandler(async (req: Request, res: Response) => {
  const note = await shareService.getSharedNoteByToken(
    getRouteParam(req.params.token),
    req.user!.id
  );

  return respond.success({
    res,
    message: 'Shared note fetched successfully',
    data: note,
  });
});

export const getShareMeta = asyncHandler(async (req: Request, res: Response) => {
  const meta = await shareService.getShareMeta(getRouteParam(req.params.id), req.user!.id);

  return respond.success({
    res,
    message: 'Share details fetched successfully',
    data: meta,
  });
});

export const shareWithUsers = asyncHandler(async (req: Request, res: Response) => {
  const meta = await shareService.shareNoteWithUsers(
    getRouteParam(req.params.id),
    req.user!.id,
    req.body as ShareUsersBody
  );

  return respond.success({
    res,
    message: 'Note shared with selected users',
    data: meta,
  });
});

export const toggleLinkShare = asyncHandler(async (req: Request, res: Response) => {
  const { enabled } = req.body as ToggleLinkShareBody;
  const result = await shareService.toggleLinkShare(
    getRouteParam(req.params.id),
    req.user!.id,
    Boolean(enabled)
  );

  return respond.success({
    res,
    message: enabled ? 'Link sharing enabled' : 'Link sharing disabled',
    data: result,
  });
});
