import { Request, Response } from 'express';
import { UrlService } from '../services/url.service';

export class AnalyticsController {
    static async getAnalytics(req: Request, res: Response) {
        try {
            const { shortUrl } = req.params;
            const analytics = await UrlService.getAnalytics(shortUrl);
            res.json(analytics);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }
}