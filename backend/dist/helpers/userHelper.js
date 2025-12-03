"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHelper = void 0;
// import exceptions
const messageTemplate_1 = require("../exceptions/messageTemplate");
//import helper 
const validateEnumValue_1 = require("./validateEnumValue");
// import helpers --------------------------------------------------------------------
const authHelpher_1 = __importDefault(require("../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
//===================================================================================================================================================
//===================================================================================================================================================
class UserHelper {
    //?==========================================================================================================
    //? function to ADD data
    //==========================================================================================================
    async add(req, res, model, payload, options) {
        const modelClassName = model.name;
        const dataName = (modelClassName?.replace(/Model$/, '') || '').toLowerCase();
        // small helper to either send a response or throw when skipResponse is set
        const fail = (status, message) => {
            if (options?.skipResponse) {
                // Throw an Error object that the caller can catch.
                // Keep message and status in the Error text so caller can inspect/log it if needed.
                const err = new Error(message);
                // Attach status for richer handling (optional)
                err.status = status;
                throw err;
            }
            else {
                (0, messageTemplate_1.sendResponse)(res, status, message);
                return;
            }
        };
        try {
            const body = (payload ?? req.body);
            // get required/unique from model metadata when not provided
            const attrs = model.getAttributes();
            const requiredFromModel = [];
            // collect required fields
            for (const [name, attr] of Object.entries(attrs)) {
                const allowNull = attr.allowNull === true;
                const hasDefault = attr.defaultValue !== undefined;
                const autoInc = attr.autoIncrement === true;
                const isPK = attr.primaryKey === true;
                if (!allowNull && !hasDefault && !autoInc && !isPK) {
                    requiredFromModel.push(name);
                }
            }
            const requiredFields = requiredFromModel;
            for (const field of requiredFields) {
                if (body[field] === undefined || body[field] === null || body[field] === "") {
                    // use fail instead of sendResponse directly
                    fail(500, `Fill all Fields please: missing ${field}`);
                    return; // unreachable if fail throws, but keeps TS happy
                }
            }
            // Enum validation
            if (options?.enumFields && options.enumFields.length > 0) {
                for (const rule of options.enumFields) {
                    const value = body[rule.field];
                    if (value === undefined || value === null || value === "") {
                        if (!rule.optional) {
                            fail(500, `Invalid ${rule.field}!`);
                            return;
                        }
                    }
                    else if (!(0, validateEnumValue_1.validateEnum)(value, rule.enumObj)) {
                        fail(500, `Invalid ${rule.field}!`);
                        return;
                    }
                }
            }
            // Primary Key settings
            const pkEntry = Object.entries(attrs).find(([_, a]) => a.primaryKey === true);
            if (pkEntry) {
                const [pkName, pkAttr] = pkEntry;
                const hasPk = body[pkName] !== undefined && body[pkName] !== null && body[pkName] !== "";
                const autoInc = pkAttr.autoIncrement === true;
                const hasDefault = pkAttr.defaultValue !== undefined;
                if (!hasPk && !autoInc && !hasDefault) {
                    const modelName = model.name.toLocaleUpperCase()[0];
                    let id;
                    let unique;
                    do {
                        id = Math.floor(100 + Math.random() * 900);
                        unique = await model.findAll({
                            where: { id: id }
                        });
                    } while (unique.length !== 0);
                    const finalId = `${modelName}${id}`;
                    body[pkName] = finalId;
                }
            }
            // non-duplicate checks
            if (options?.nonDuplicateFields && options.nonDuplicateFields.length > 0) {
                for (const field of options.nonDuplicateFields) {
                    const duplicated = await model.findOne({
                        where: { [field]: body[field] }
                    });
                    if (duplicated) {
                        fail(500, `${dataName} was not Added, because another ${dataName} with the same ${field} already exists!`);
                        return;
                    }
                }
            }
            // transform and create
            const finalData = options?.transform ? await options.transform(body) : body;
            await model.create(finalData);
            const success = `${dataName} was Added successfully`;
            if (!options?.skipResponse) {
                (0, messageTemplate_1.sendResponse)(res, 200, success);
            }
            console.log(success);
            return;
        }
        catch (error) {
            // if skipResponse we should rethrow so caller can handle and send response exactly once
            if (options?.skipResponse) {
                // If error already came from fail() it will be thrown and caught here; rethrow it to be handled by caller
                throw error;
            }
            else {
                (0, messageTemplate_1.sendResponse)(res, 500, `Error Found while creating ${dataName}. ${error}`);
                return;
            }
        }
    }
    //?==========================================================================================================
    //? function to Remove data
    //==========================================================================================================
    async remove(req, res, model, uniqueField, uniqueValue) {
        const modelClassName = model.name;
        const dataName = (modelClassName?.replace(/Model$/, '') || '').toLowerCase(); // remove the word 'Model' from the name 
        try {
            if (!uniqueValue) {
                (0, messageTemplate_1.sendResponse)(res, 500, `No ${uniqueField} were found`);
                return;
            }
            //ensure the user exists -----------------------------------------------------
            const fieldExists = await model.findOne({
                where: {
                    [uniqueField]: uniqueValue
                },
                attributes: [uniqueField]
            });
            if (!fieldExists) {
                (0, messageTemplate_1.sendResponse)(res, 500, `No ${dataName} found with this ${uniqueField}!`);
                return;
            }
            // Delete the user from the database ---------------------------------------------------
            const deletedField = await model.destroy({
                where: {
                    [uniqueField]: uniqueValue,
                }
            });
            if (deletedField === 0) {
                (0, messageTemplate_1.sendResponse)(res, 500, `Field wasn't removed. Ensure you entered correct ${uniqueField}`);
                return;
            }
            //if the user was removed 
            (0, messageTemplate_1.sendResponse)(res, 200, `${dataName} was successfully Removed`);
            return;
            // ======================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while removing ${dataName}. ${error}`);
            return;
        }
    }
    //?==========================================================================================================
    //? function to Update data
    //==========================================================================================================
    // async update( req: Request, res: Response, model: ModelStatic<Model<any, any>>, uniqueField: string, uniqueValue: any, values: Record<string, any>,
    async update(req, res, model, values, options) {
        //get the name of the model
        const modelClassName = model.name;
        const dataName = (modelClassName?.replace(/Model$/, '') || '').toLowerCase();
        try {
            const body = req.body;
            const uniqueField = 'id';
            const uniqueValue = body.id;
            // check that uniqueValue is not empty --------------------------------------------------
            if (uniqueValue === undefined || uniqueValue === null || uniqueValue === "") {
                (0, messageTemplate_1.sendResponse)(res, 500, `No ${uniqueField} were found`);
                return;
            }
            //check that updated values exists 
            if (!values || Object.keys(values).length === 0) {
                (0, messageTemplate_1.sendResponse)(res, 500, "Please provide the data!");
                return;
            }
            // Enum validation --------------------------------------------------------------------------
            if (options?.enumFields && options.enumFields.length > 0) {
                for (const rule of options.enumFields) {
                    const value = values[rule.field];
                    if (value === undefined || value === null || value === "") {
                        if (!rule.optional) {
                            continue;
                        }
                    }
                    else if (!(0, validateEnumValue_1.validateEnum)(value, rule.enumObj)) {
                        (0, messageTemplate_1.sendResponse)(res, 500, `Invalid ${rule.field}!`);
                        return;
                    }
                }
            }
            //check reocred exists --------------------------------------------------------------------
            const record = await model.findOne({
                where: {
                    [uniqueField]: uniqueValue
                },
                attributes: [uniqueField]
            });
            if (!record) {
                (0, messageTemplate_1.sendResponse)(res, 500, `No ${dataName} found with this ${uniqueField}!`);
                return;
            }
            //----------------------------------------------------------------------------------------------
            //apply transform (if exists)
            const finalUpdates = options?.transform ? await options.transform(values) : values;
            const current = await model.findOne({
                where: { [uniqueField]: uniqueValue },
                attributes: Object.keys(finalUpdates)
            });
            const keys = Object.keys(finalUpdates);
            const changedKeys = keys.filter(k => {
                const currVal = current?.get ? current.get(k) : current?.[k];
                const newVal = finalUpdates[k];
                return currVal !== newVal;
            });
            if (changedKeys.length === 0) {
                (0, messageTemplate_1.sendResponse)(res, 200, `${dataName} is already up to date (no changes detected)`);
                return;
            }
            //------------------------------------------------------------------------------------------
            //prepare updates to apply
            const updatesToApply = {};
            for (const key of changedKeys)
                updatesToApply[key] = finalUpdates[key];
            const [updatedCount] = await model.update(updatesToApply, {
                where: {
                    [uniqueField]: uniqueValue
                }
            });
            if (updatedCount === 0) {
                (0, messageTemplate_1.sendResponse)(res, 500, `${dataName} wasn't updated. Please verify the provided fields.`);
                return;
            }
            (0, messageTemplate_1.sendResponse)(res, 200, `${dataName} was updated successfully`);
            return;
            //===================================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while updatein ${dataName}.  ${error}`);
            return;
        }
    }
}
exports.UserHelper = UserHelper;
//# sourceMappingURL=userHelper.js.map