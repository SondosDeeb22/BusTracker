"use strict";
//===================================================================================================
//? Import Sections
//===================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const sequelize_1 = require("sequelize");
const validateEnumValue_1 = require("../validateEnumValue");
const errors_1 = require("../../errors");
//===================================================================================================
//? function to Update data
//===================================================================================================
const update = async (model, values, options) => {
    //get the name of the model
    const modelClassName = model.name;
    const dataName = (modelClassName?.replace(/Model$/, "") || "").toLowerCase();
    try {
        const attrsForPk = model.getAttributes();
        const pkEntry = Object.entries(attrsForPk).find(([_, a]) => a.primaryKey === true);
        const uniqueField = pkEntry ? pkEntry[0] : "id";
        const uniqueValue = values?.[uniqueField];
        // check that uniqueValue is not empty --------------------------------------------------
        if (uniqueValue === undefined || uniqueValue === null || uniqueValue === "") {
            throw new errors_1.ValidationError("common.errors.validation.fillAllFields");
        }
        //check that updated values exists
        if (!values || Object.keys(values).length === 0) {
            throw new errors_1.ValidationError("common.errors.validation.fillAllFields");
        }
        // normalize empty strings to null for nullable columns -------------------------------------
        const attrs = model.getAttributes();
        for (const [name, attr] of Object.entries(attrs)) {
            const allowNull = attr.allowNull === true;
            const value = values[name];
            if (allowNull && typeof value === "string" && value.trim() === "") {
                values[name] = null;
            }
        }
        // Enum validation --------------------------------------------------------------------------
        if (options?.enumFields && options.enumFields.length > 0) {
            for (const rule of options.enumFields) {
                const value = values[rule.field];
                const hasField = Object.prototype.hasOwnProperty.call(values, rule.field);
                // PATCH semantics: if the client didn't send this field, don't validate it.
                if (!hasField)
                    continue;
                // If the client sent it, enforce requiredness/validity.
                if ((value === undefined || value === null || value === "") && !rule.optional) {
                    throw new errors_1.ValidationError("common.errors.validation.missingField");
                }
                if (value != null && value !== "") {
                    if (typeof value !== "string" && typeof value !== "number") {
                        throw new errors_1.ValidationError("common.errors.validation.invalidField");
                    }
                    if (!(0, validateEnumValue_1.validateEnum)(value, rule.enumObj)) {
                        throw new errors_1.ValidationError("common.errors.validation.invalidField");
                    }
                }
            }
        }
        //check reocred exists --------------------------------------------------------------------
        const record = await model.findOne({
            where: {
                [uniqueField]: uniqueValue,
            },
            attributes: [uniqueField],
        });
        if (!record) {
            throw new errors_1.NotFoundError("common.errors.notFound");
        }
        //----------------------------------------------------------------------------------------------
        //apply transform (if exists)
        const finalUpdates = options?.transform ? await options.transform(values) : values;
        const current = (await model.findOne({
            where: { [uniqueField]: uniqueValue },
            attributes: Object.keys(finalUpdates),
        }));
        const keys = Object.keys(finalUpdates);
        const changedKeys = keys.filter((k) => {
            const currVal = current?.get
                ? current.get(k)
                : current?.[k];
            const newVal = finalUpdates[k];
            return currVal !== newVal;
        });
        if (changedKeys.length === 0) {
            return { updated: false, updatedCount: 0 };
        }
        //------------------------------------------------------------------------------------------
        // non-duplicate checks (only for provided + changed fields)
        if (options?.nonDuplicateFields && options.nonDuplicateFields.length > 0) {
            for (const field of options.nonDuplicateFields) {
                if (!changedKeys.includes(field))
                    continue;
                const value = finalUpdates[field];
                if (value == null || value === "")
                    continue;
                const duplicate = await model.findOne({
                    where: {
                        [field]: value,
                        [uniqueField]: { [sequelize_1.Op.ne]: uniqueValue },
                    },
                    attributes: [uniqueField],
                });
                if (duplicate) {
                    throw new errors_1.ConflictError("common.errors.validation.duplicate");
                }
            }
        }
        //------------------------------------------------------------------------------------------
        //prepare updates to apply
        const updatesToApply = {};
        for (const key of changedKeys)
            updatesToApply[key] = finalUpdates[key];
        const [updatedCount] = await model.update(updatesToApply, {
            where: {
                [uniqueField]: uniqueValue,
            },
        });
        if (updatedCount === 0) {
            throw new errors_1.ConflictError("common.crud.notUpdated");
        }
        return { updated: true, updatedCount };
        //===================================================================================
    }
    catch (error) {
        console.error(`Error occured while updating ${dataName}.`, error);
        throw error;
    }
};
exports.update = update;
//# sourceMappingURL=update.js.map