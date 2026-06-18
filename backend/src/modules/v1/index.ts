import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import notesRoutes from './notes/notes.routes';

const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/notes', notesRoutes);

export default v1Router;
