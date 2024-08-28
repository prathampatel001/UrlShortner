// routes/urlRoutes.ts
import { Router } from 'express';
import { createShortUrl, deleteShortUrlById, getShortUrl, updateUrlById } from '../URL/UrlController'

const router = Router();

router.post('/url/createShortUrl',createShortUrl);
router.delete("/url/deleteShortUrl/:id",deleteShortUrlById);
router.put("/url/updateUrl/:id",updateUrlById)
router.post("/url/getUrl/:id",getShortUrl)

export default router;
