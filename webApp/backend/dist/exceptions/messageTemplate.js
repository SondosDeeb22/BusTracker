"use strict";
//===========================================================================================================
//? template function for the messages we want to inform the user about 
//===========================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, status, message = null, data = null) => {
    console.log(message, data);
    res.status(status).json({ message: message, data });
};
exports.sendResponse = sendResponse;
//===========================================================================================================
//# sourceMappingURL=messageTemplate.js.map