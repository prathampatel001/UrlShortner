import { Router } from 'express';
import { filterAnalyticsByDeviceGeoInfoAndTimeStamp, getAllUrlCounts, getDeviceData, getGeoData, getPromotionalWebsiteVisitInfo, singleUrlCount } from './analyticsController';

const router = Router();

router.get('/analytics/clicks/:id',singleUrlCount);
router.get('/analytics/clicks',getAllUrlCounts);

router.get('/analytics/geoInfo/:id',getGeoData)
router.get('/analytics/deviceInfo/:id',getDeviceData)
router.get('/analytics/redirectToPromotionalWeb',getPromotionalWebsiteVisitInfo)

//Filter routes
// router.get('/analytics/filter/date', filterAnalyticsByDeviceGeoInfoAndDate);
router.get('/analytics/filter/timeRange', filterAnalyticsByDeviceGeoInfoAndTimeStamp);


export default router;
