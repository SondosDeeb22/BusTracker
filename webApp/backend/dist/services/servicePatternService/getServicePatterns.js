"use strict";
//======================================================================================================================
//? Importing
//======================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServicePatterns = void 0;
const servicePatternModel_1 = __importDefault(require("../../models/servicePatternModel"));
const operatingHoursModel_1 = __importDefault(require("../../models/operatingHoursModel"));
const InternalError_1 = require("../../errors/InternalError");
//======================================================================================================================
const getServicePatterns = async () => {
    try {
        const rows = await servicePatternModel_1.default.findAll({
            attributes: ["servicePatternId", "title"],
            include: [
                {
                    model: operatingHoursModel_1.default,
                    as: "operatingHours",
                    attributes: ["operatingHourId", "hour"],
                },
            ],
            order: [
                ["servicePatternId", "ASC"],
                [{ model: operatingHoursModel_1.default, as: "operatingHours" }, "hour", "ASC"],
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
        return { messageKey: "common.crud.fetched", data };
    }
    catch (error) {
        console.error("Error occured while fetching service patterns.", error);
        throw new InternalError_1.InternalError("common.errors.internal");
    }
};
exports.getServicePatterns = getServicePatterns;
//# sourceMappingURL=getServicePatterns.js.map