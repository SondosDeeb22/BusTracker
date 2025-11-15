"use strict";
//===================================================================================================
//? Importing
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
//import models
const userModel_1 = __importDefault(require("../models/userModel"));
//import Enums
const userEnum_1 = require("../enums/userEnum");
const userHelper_1 = require("../helpers/userHelper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class DriverService {
    //===================================================================================================
    //? function to Add Driver
    //===================================================================================================
    async addDriver(req, res) {
        await helper.add(req, res, userModel_1.default, req.body, {
            nonDuplicateFields: ['email'],
            //-----------------------------------------------------------
            enumFields: [
                { field: "status", enumObj: userEnum_1.status },
                { field: "role", enumObj: userEnum_1.role },
                { field: "gender", enumObj: userEnum_1.gender }
            ],
            //-----------------------------------------------------------
            transform: async (data) => {
                const out = { ...data };
                // normalize email
                if (out.email)
                    out.email = out.email.toLowerCase().trim();
                // hash password if present
                if (out.hashedPassword) {
                    const saltRounds = 10;
                    out.hashedPassword = await bcrypt_1.default.hash(out.hashedPassword, saltRounds);
                }
                return out;
            },
        });
    }
    //===================================================================================================
    //? function to Remove Driver
    //===================================================================================================
    async removeDriver(req, res) {
        await helper.remove(req, res, userModel_1.default, 'id', req.body.id);
    }
    //===================================================================================================
    //? function to Update Driver
    //===================================================================================================
    async updateDriver(req, res) {
        await helper.update(req, res, userModel_1.default, req.body, {
            enumFields: [{ field: "status", enumObj: userEnum_1.status },
                { field: "role", enumObj: userEnum_1.role },
                { field: "gender", enumObj: userEnum_1.gender }
            ],
            //---------------------------------------------
            successMessage: 'Driver was updated',
        });
    }
}
exports.DriverService = DriverService;
//# sourceMappingURL=driverService.js.map