//============================================================================================================================================================
//?importing 
//============================================================================================================================================================

import { Response } from 'express';
import { AppError } from '../errors';
import { sendResponse } from '../exceptions/messageTemplate';


//============================================================================================================================================================
export const handleControllerError = (res: Response, error: unknown): void => {
    if (error instanceof AppError) {
        sendResponse(res, error.statusCode, error.message, { code: error.code });
        return;
    }

    if (error instanceof Error && error.message.startsWith('common.')) {
        sendResponse(res, 500, error.message);
        return;
    }

    sendResponse(res, 500, 'common.errors.internal');
};


//============================================================================================================================================================