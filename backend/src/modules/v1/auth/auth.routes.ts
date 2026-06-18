import { Router } from 'express';
import * as authController from './auth.controller';
import { protect } from './auth.middleware';

const authRouter = Router();

authRouter.post('/google', authController.googleSignIn);
authRouter.post('/refresh', authController.refreshToken);
authRouter.post('/logout', protect, authController.logout);
authRouter.get('/me', protect, authController.getMe);

export default authRouter;
