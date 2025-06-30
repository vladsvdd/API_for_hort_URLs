import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

router.post('/shorten', UrlController.shorten);
router.get('/urls', UrlController.getAllUrls);
router.get('/:shortUrl', UrlController.redirect);
router.get('/info/:shortUrl', UrlController.info);
router.delete('/delete/:shortUrl', UrlController.delete);
router.get('/analytics/:shortUrl', AnalyticsController.getAnalytics);

export default router;