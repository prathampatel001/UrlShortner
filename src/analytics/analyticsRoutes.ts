import { Router } from 'express';
import { getAllUrlCounts, getDeviceData, getGeoData, getPromotionalWebsiteVisitInfo, singleUrlCount } from './analyticsController';

const router = Router();

router.get('/analytics/clicks/:id',singleUrlCount);
router.get('/analytics/clicks',getAllUrlCounts);

router.get('/analytics/geoInfo/:id',getGeoData)
router.get('/analytics/deviceInfo/:id',getDeviceData)
router.get('/analytics/redirectToPromotionalWeb',getPromotionalWebsiteVisitInfo)



export default router;
