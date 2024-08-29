// routes/urlRoutes.ts
import { Router } from 'express';
import { createSession, deleteSessionById, validatePassAndRedirect } from './sessionController';

const router = Router();

router.post('/session/createSession/:id',createSession);
router.post("/session/validatePassword/:id",validatePassAndRedirect)
router.delete("/session/deleteSession/:id",deleteSessionById)

export default router;
