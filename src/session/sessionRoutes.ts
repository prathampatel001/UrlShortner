// routes/urlRoutes.ts
import { Router } from 'express';
import { sessionInfo } from './sessionController';

const router = Router();

router.post('/session/:id',sessionInfo);


export default router;
