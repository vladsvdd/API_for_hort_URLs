import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError';

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    res.status(statusCode).json({
        error: err.message || 'Internal Server Error'
    });
}
