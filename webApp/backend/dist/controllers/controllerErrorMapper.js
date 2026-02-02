"use strict";
//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControllerError = void 0;
const errors_1 = require("../errors");
const messageTemplate_1 = require("../exceptions/messageTemplate");
//============================================================================================================================================================
const handleControllerError = (res, error) => {
    if (error instanceof errors_1.AppError) {
        (0, messageTemplate_1.sendResponse)(res, error.statusCode, error.message, { code: error.code });
        return;
    }
    if (error instanceof Error && error.message.startsWith('common.')) {
        (0, messageTemplate_1.sendResponse)(res, 500, error.message);
        return;
    }
    (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
};
exports.handleControllerError = handleControllerError;
//============================================================================================================================================================
//# sourceMappingURL=controllerErrorMapper.js.map