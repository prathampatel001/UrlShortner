// routes/urlRoutes.ts
import { Router } from 'express';
import { createShortUrl, deleteShortUrlById, getShortUrl, getShortUrlWithPassword, updateUrlById } from '../URL/UrlController'

const router = Router();

router.post('/url/createShortUrl',createShortUrl);
router.delete("/url/deleteShortUrl/:id",deleteShortUrlById);
router.put("/url/updateUrl/:id",updateUrlById)
router.post("/url/getShortUrlWithPassword/:id",getShortUrlWithPassword)
router.get("/url/getUrl/:id",getShortUrl)


export default router;
