// url.service.ts
import {sequelize, Url} from '../models/url.model';
import {Analytics} from '../models/analytics.model';
import {v4 as uuidv4} from 'uuid';
import {HttpError} from "../errors/HttpError";

export class UrlService {
    static async createShortUrl(originalUrl: string, alias?: string, expiresAt?: Date) {
        const shortUrl = alias || this.generateShortId();

        const exists = await Url.findOne({where: {shortUrl}});
        if (exists) throw new HttpError(409, 'URL alias already exists');

        const url = await Url.create({
            originalUrl,
            shortUrl,
            expiresAt,
            clickCount: 0
        });

        // Явно возвращаем все необходимые поля
        return {
            shortUrl: url.shortUrl,
            originalUrl: url.originalUrl,
            expiresAt: url.expiresAt,
            createdAt: url.createdAt.toISOString(),
            clickCount: url.clickCount
        };
    }

    static async getAllUrls(order: Array<[string, 'ASC' | 'DESC']> = [['createdAt', 'DESC']]) {
        return await Url.findAll({
            order: order,
        });
    }

    static async getOriginalUrl(shortUrl: string, ipAddress: string) {
        const transaction = await sequelize.transaction();

        try {
            const url = await Url.findOne({where: {shortUrl}});
            if (!url) {
                throw new HttpError(404, 'URL not found');
            }

            if (url.expiresAt && Date.now() > url.expiresAt.getTime()) {
                throw new HttpError(400, 'URL has expired');
            }

            await url.increment('clickCount', {transaction});
            await Analytics.create({urlId: url.id, ipAddress}, {transaction});
            await transaction.commit();

            return url.originalUrl;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async getUrlInfo(shortUrl: string) {
        const url = await Url.findOne({
            where: {shortUrl},
            attributes: ['shortUrl', 'originalUrl', 'expiresAt', 'createdAt', 'clickCount']
        });

        if (!url) {
            throw new HttpError(404, 'URL not found');
        }

        return {
            shortUrl: url.shortUrl,
            originalUrl: url.originalUrl,
            expiresAt: url.expiresAt,
            createdAt: url.createdAt.toISOString(),
            clickCount: url.clickCount
        };
    }

    static async deleteUrl(shortUrl: string) {
        const url = await Url.findOne({where: {shortUrl}});
        if (!url) {
            throw new HttpError(404, 'URL not found');
        }
        await url.destroy();
    }

    static async getAnalytics(shortUrl: string) {
        const url = await Url.findOne({where: {shortUrl}});
        if (!url) {
            throw new HttpError(404, 'URL not found');
        }

        const analytics = await Analytics.findAll({
            where: {urlId: url.id},
            order: [['accessedAt', 'DESC']],
            limit: 5,
        });

        return {
            clickCount: url.clickCount,
            recentIps: analytics.map(a => a.ipAddress),
        };
    }

    private static generateShortId(): string {
        return uuidv4().substring(0, 8);
    }
}