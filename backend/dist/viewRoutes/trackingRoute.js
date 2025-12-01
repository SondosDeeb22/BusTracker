"use strict";
//===========================================================================================================================
// setup Express route
//===========================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
//===========================================================================================================================
// Router
//===========================================================================================================================
const router = express_1.default.Router();
router.use("/dist", express_1.default.static(path_1.default.join(__dirname, '../../../frontend0/dist'))); // used frontend0 instead of frontend
//===========================================================================================================================
exports.default = router;
//# sourceMappingURL=trackingRoute.js.map