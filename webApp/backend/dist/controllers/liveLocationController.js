"use strict";
//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveLocationController = void 0;
const liveLocationService_1 = require("../services/liveLocationService");
const liveLocationService = new liveLocationService_1.LiveLocationService();
const messageTemplate_1 = require("../exceptions/messageTemplate");
const controllerErrorMapper_1 = require("./controllerErrorMapper");
//============================================================================================================================================================
class LiveLocationController {
    // =================================================================================================================================
    //? Update live location (create if not exists)
    // =================================================================================================================================
    async updateLiveLocation(req, res) {
        try {
            const result = await liveLocationService.updateLiveLocation(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
            // -------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
}
exports.LiveLocationController = LiveLocationController;
//# sourceMappingURL=liveLocationController.js.map