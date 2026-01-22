"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePatternService = void 0;
const messageTemplate_1 = require("../exceptions/messageTemplate");
const servicePatternModel_1 = __importDefault(require("../models/servicePatternModel"));
const operatingHoursModel_1 = __importDefault(require("../models/operatingHoursModel"));
//======================================================================================================================
//? Service
//======================================================================================================================
class ServicePatternService {
    //==================================================================================================================
    //? Fetch all service patterns with their operating hours
    //==================================================================================================================
    async getServicePatterns(req, res) {
        try {
            const rows = await servicePatternModel_1.default.findAll({
                attributes: ['servicePatternId', 'title'],
                include: [
                    {
                        model: operatingHoursModel_1.default,
                        as: 'operatingHours',
                        attributes: ['operatingHourId', 'hour'],
                    },
                ],
                order: [
                    ['servicePatternId', 'ASC'],
                    [{ model: operatingHoursModel_1.default, as: 'operatingHours' }, 'hour', 'ASC'],
                ],
            });
            const data = rows.map((row) => {
                const operatingHoursRaw = row.operatingHours ?? [];
                return {
                    servicePatternId: row.servicePatternId,
                    title: row.title,
                    operatingHours: operatingHoursRaw.map((oh) => ({
                        operatingHourId: oh.operatingHourId,
                        hour: String(oh.hour),
                    })),
                };
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, null, data);
        }
        catch (error) {
            return (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while fetching service patterns ${error}`);
        }
    }
}
exports.ServicePatternService = ServicePatternService;
//# sourceMappingURL=servicePatternService.js.map