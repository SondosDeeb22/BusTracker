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
router.use("/dist", express_1.default.static(path_1.default.join(__dirname, '../../../frontend/dist')));
// console.log(path.join(__dirname, "../../../frontend/src/views/index.ejs") + "-----------------------------------------")
router.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render(path_1.default.join(__dirname, "../../../frontend/src/views/index.ejs"));
});
//===========================================================================================================================
exports.default = router;
//# sourceMappingURL=trackingRoute.js.map