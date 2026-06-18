import { Router } from 'express';
import healthRoutes from './health.routes';
import v1Routes from '../modules/v1';

const router = Router();

router.use(healthRoutes);
router.use(v1Routes);

export default router;
