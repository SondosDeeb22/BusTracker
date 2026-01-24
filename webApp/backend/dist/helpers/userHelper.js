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
        //----------------------------------------------------------------
        const modelClassName = model.name;
        const dataName = (modelClassName?.replace(/Model$/, '') || '').toLowerCase();
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
                    const status = 500;
                    (0, messageTemplate_1.sendResponse)(res, status, 'common.validation.fillAllFields');
                    return;
                }
            }
            // normalize empty strings to null for nullable columns
            for (const field in body) {
                if (!requiredFields.includes(field) && body[field] === "") { // to ensure column field is optional and it's empty string, so we make it Null
                    body[field] = null;
                }
            }
            // Enum validation
            if (options?.enumFields && options.enumFields.length > 0) {
                for (const rule of options.enumFields) {
                    const value = body[rule.field];
                    if (value === undefined || value === null || value === "") {
                        if (!rule.optional) {
                            const status = 500;
                            (0, messageTemplate_1.sendResponse)(res, status, 'common.validation.invalidField');
                            return;
                        }
                    }
                    else if (!(0, validateEnumValue_1.validateEnum)(value, rule.enumObj)) {
                        const status = 500;
                        (0, messageTemplate_1.sendResponse)(res, status, 'common.validation.invalidField');
                        return;
                    }
                }
            }
            // Primary Key settings --------------------------------------------------------------------------------
            const pkEntry = Object.entries(attrs).find(([_, a]) => a.primaryKey === true);
            if (pkEntry) {
                const [pkName, pkAttr] = pkEntry;
                // pkName is the actual primary-key column name for the given model (e.g. 'scheduleId', 'busId', ...)
                // We avoid assuming a generic 'id' column because different tables might use different PK names
                const hasPk = body[pkName] !== undefined && body[pkName] !== null && body[pkName] !== "";
                const autoInc = pkAttr.autoIncrement === true;
                const hasDefault = pkAttr.defaultValue !== undefined;
                if (!hasPk && !autoInc && !hasDefault) {
                    // If the PK isn't provided, isn't auto-increment, and has no default value,
                    //we generate a new PK value using the model name prefix(First letter) + next numeric suffix.
                    const modelName = model.name.toLocaleUpperCase()[0];
                    // Deterministic collision-safe generation:
                    // Try IDs from 100 -> 999 and pick the first one that does NOT exist in DB
                    // This keeps the old behavior of "check if used before" without randomness
                    let finalId = '';
                    for (let n = 100; n <= 999; n++) {
                        const candidate = `${modelName}${String(n).padStart(3, '0')}`;
                        const exists = await model.findOne({
                            where: { [pkName]: candidate },
                            attributes: [pkName],
                        });
                        if (!exists) {
                            finalId = candidate;
                            break;
                        }
                    }
                    if (!finalId) {
                        console.error('Cannot generate a new primary key. ID space is exhausted.');
                        (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                        return;
                    }
                    body[pkName] = finalId;
                }
            }
            //-----------------------------------------------------------------------------------------------------
            // non-duplicate checks -----------------------------------------------------------------------------
            if (options?.nonDuplicateFields && options.nonDuplicateFields.length > 0) {
                for (const field of options.nonDuplicateFields) {
                    const duplicated = await model.findOne({
                        where: { [field]: body[field] }
                    });
                    if (duplicated) {
                        const status = 500;
                        (0, messageTemplate_1.sendResponse)(res, status, 'common.validation.duplicate');
                        return;
                    }
                }
            }
            //-----------------------------------------------------------------------------------------------------
            // apply transform (if existed) and create
            const finalData = options?.transform ? await options.transform(body) : body;
            await model.create(finalData);
            (0, messageTemplate_1.sendResponse)(res, 200, options?.successMessageKey ?? 'common.crud.added');
            console.log(`${dataName} was added successfully`);
            return;
            //==========================================================================================================
        }
        catch (error) {
            messageTemplate_1.sendResponse;
            console.error(`Error occured while creating ${dataName}.`, error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
            return;
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
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.required');
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
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.crud.notFound');
                return;
            }
            // Delete the user from the database ---------------------------------------------------
            const deletedField = await model.destroy({
                where: {
                    [uniqueField]: uniqueValue,
                }
            });
            if (deletedField === 0) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.crud.notRemoved');
                return;
            }
            //if the user was removed 
            (0, messageTemplate_1.sendResponse)(res, 200, 'common.crud.removed');
            return;
            // ======================================================================
        }
        catch (error) {
            console.error(`Error occured while removing ${dataName}.`, error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
            return;
        }
    }
    //?==========================================================================================================
    //? function to Update data
    //==========================================================================================================
    async update(req, res, model, values, options) {
        //get the name of the model
        const modelClassName = model.name;
        const dataName = (modelClassName?.replace(/Model$/, '') || '').toLowerCase();
        try {
            const body = req.body;
            const attrsForPk = model.getAttributes();
            const pkEntry = Object.entries(attrsForPk).find(([_, a]) => a.primaryKey === true);
            const uniqueField = pkEntry ? pkEntry[0] : 'id';
            const uniqueValue = body?.[uniqueField] ?? values?.[uniqueField];
            // check that uniqueValue is not empty --------------------------------------------------
            if (uniqueValue === undefined || uniqueValue === null || uniqueValue === "") {
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.required');
                return;
            }
            //check that updated values exists 
            if (!values || Object.keys(values).length === 0) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.noData');
                return;
            }
            // normalize empty strings to null for nullable columns -------------------------------------
            const attrs = model.getAttributes();
            for (const [name, attr] of Object.entries(attrs)) {
                const allowNull = attr.allowNull === true;
                const value = values[name];
                if (allowNull && typeof value === 'string' && value.trim() === '') {
                    values[name] = null;
                }
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
                        (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.invalidField');
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
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.crud.notFound');
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
                (0, messageTemplate_1.sendResponse)(res, 200, 'common.crud.noChanges');
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
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.crud.notUpdated');
                return;
            }
            (0, messageTemplate_1.sendResponse)(res, 200, 'common.crud.updated');
            return;
            //===================================================================================
        }
        catch (error) {
            console.error(`Error occured while updating ${dataName}.`, error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
            return;
        }
    }
}
exports.UserHelper = UserHelper;
//# sourceMappingURL=userHelper.js.map