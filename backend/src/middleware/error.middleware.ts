import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean; 
}

export const createError = (message: string, statusCode: number): AppError => {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Internal Server Error";

    res.status(statusCode).json({ success: false, message });
}

export const notFoundHandler = (req: Request, res: Response, nxt: NextFunction): void => {
    nxt(createError(`Route not found: ${req.originalUrl}`, 404));
}