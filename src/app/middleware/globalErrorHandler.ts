import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import config from "../../config";
import ApiError from "../../errors/apiError";
import handleCastError from "../../errors/castError";
import handlePrismaClientKnowRequestError from "../../errors/prismaClientKnownRequestError";
import handlePrismaValidationError from "../../errors/prismaValidationError";
import handleValidationError from "../../errors/validationError";
import zodError from "../../errors/zodError";
import { IGenericErrorMessage } from "../../interfaces.ts/genericErrorMessage";

const globalErrorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    // console.log('total error : ',err)

    let statusCode = 500;
    let message = 'Something went wrong !';
    let errorMessages: IGenericErrorMessage[] = [];

    if (err.name === 'ValidationError') {
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorMessages = simplifiedError.errorMessages
    } else if ( 
        err instanceof ZodError
        // err.name === 'ZodError'
        ) {
        const simplifiedError = zodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorMessages = simplifiedError.errorMessages
    } else if (err.name === 'CastError') {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorMessages = simplifiedError.errorMessages
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        const simplifiedError = handlePrismaValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorMessages = simplifiedError.errorMessages
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = handlePrismaClientKnowRequestError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorMessages = simplifiedError.errorMessages
    } else if (err instanceof ApiError) {
        statusCode = err?.statusCode
        message = err.message
        errorMessages = err?.message ? [
            {
                path: '',
                message: err?.message
            }
        ] : []
    } else if (err instanceof Error) {
        message = err?.message;
        errorMessages = err?.message
            ? [
                {
                    path: '',
                    message: err?.message
                }
            ]
            : [];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config.env !== 'production' ? err?.stack : undefined
    })

}

export default globalErrorHandler