// url.controller.ts
import {Request, Response} from 'express';
import {UrlService} from '../services/url.service';
import {isAlphanumeric, isValidUrl, validateAlias} from "../utils/helpers";
import {HttpError} from "../errors/HttpError";

export class UrlController {
    static async shorten(req: Request, res: Response) {
        try {
            const {originalUrl, alias, expiresAt} = req.body;

            if (alias) {
                const error = validateAlias(alias);
                if (error) return res.status(400).json({error});
            }

            if (!originalUrl) {
                return res.status(400).json({error: 'originalUrl is required'});
            }

            if (!isValidUrl(originalUrl)) {
                return res.status(400).json({error: 'Invalid URL format'});
            }

            let expiresAtDate: Date | undefined = undefined;

            if (expiresAt) {
                const parsedDate = new Date(expiresAt);
                if (isNaN(parsedDate.getTime())) {
                    return res.status(400).json({error: 'Invalid expiration date'});
                }
                if (parsedDate.getTime() < Date.now()) {
                    return res.status(400).json({error: 'Expiration date must be in the future'});
                }
                expiresAtDate = parsedDate;
            }

            const url = await UrlService.createShortUrl(
                originalUrl,
                alias,
                expiresAtDate,
            );

            res.status(200).json(url);
        } catch (error: any) {
            const status = error instanceof HttpError ? error.statusCode : 400;
            res.status(status).json({error: error.message});
        }
    }

    static async redirect(req: Request, res: Response) {
        const {shortUrl} = req.params;
        const ipAddress = req.ip || 'unknown';
        const originalUrl = await UrlService.getOriginalUrl(shortUrl, ipAddress);
        res.redirect(302, originalUrl);
    }

    static async info(req: Request, res: Response) {
        const {shortUrl} = req.params;
        const url = await UrlService.getUrlInfo(shortUrl);
        res.json(url);
    }

    static async delete(req: Request, res: Response) {
        const {shortUrl} = req.params;
        await UrlService.deleteUrl(shortUrl);
        res.json({message: 'URL deleted successfully'});
    }

    static async getAllUrls(req: Request, res: Response) {
        const urls = await UrlService.getAllUrls();
        res.json(urls);
    }
}