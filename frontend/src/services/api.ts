import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const useApi = () => {
    const createShortUrl = (originalUrl: string, alias?: string, expiresAt?: string) => {
        return api.post('/shorten', {
            originalUrl,
            alias,
            expiresAt,
        });
    };

    const getUrls = () => {
        return api.get('/urls');
    };

    const getUrlInfo = (shortUrl: string) => {
        return api.get(`/info/${shortUrl}`);
    };

    const deleteUrl = (shortUrl: string) => {
        return api.delete(`/delete/${shortUrl}`);
    };

    const getAnalytics = (shortUrl: string) => {
        return api.get(`/analytics/${shortUrl}`);
    };

    return {
        createShortUrl,
        getUrls,
        getUrlInfo,
        deleteUrl,
        getAnalytics,
    };
};