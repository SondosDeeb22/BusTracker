"use strict";
//===================================================================================================
//? Import Sections
//===================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
const sequelize_1 = require("sequelize");
const validateEnumValue_1 = require("../validateEnumValue");
const errors_1 = require("../../errors");
//===================================================================================================
//? function to ADD data
//===================================================================================================
const add = async (model, payload, options) => {
    const attrs = model.getAttributes();
    const body = { ...payload };
    try {
        // ---------------------------------------------------------------------
        // required fields (from model metadata)
        const requiredFields = [];
        for (const [name, attr] of Object.entries(attrs)) {
            const a = attr;
            if (!a.allowNull && a.defaultValue === undefined && !a.autoIncrement && !a.primaryKey) {
                requiredFields.push(name);
            }
        }
        for (const field of requiredFields) {
            if (body[field] === undefined || body[field] === null || body[field] === "") {
                throw new errors_1.ValidationError("common.errors.validation.fillAllFields");
            }
        }
        // Normalize empty strings to null (only for optional fields)
        for (const key of Object.keys(body)) {
            if (!requiredFields.includes(key) && body[key] === "") {
                body[key] = null;
            }
        }
        // ---------------------------------------------------------------------
        // enum validation
        if (options?.enumFields) {
            for (const rule of options.enumFields) {
                const value = body[rule.field];
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
        // ---------------------------------------------------------------------
        // primary key generation
        const pkEntry = Object.entries(attrs).find(([_, a]) => a.primaryKey);
        if (pkEntry) {
            const [pkName, pkAttr] = pkEntry;
            const pkAttrTyped = pkAttr;
            const hasPk = body[pkName] != null && body[pkName] !== "";
            // If the PK isn't provided, isn't auto-increment, and has no default value,
            // we generate a new PK value using the model name prefix(First letter) + next numeric suffix
            if (!hasPk && !pkAttrTyped.autoIncrement && pkAttrTyped.defaultValue === undefined) {
                const prefix = model.name.toUpperCase()[0];
                let found = false;
                // Deterministic collision-safe generation:
                // Try IDs from 100 -> 999 and pick the first one that does NOT exist in DB
                for (let n = 100; n <= 999; n++) {
                    const generatedId = `${prefix}${String(n).padStart(3, "0")}`;
                    const exists = (await model.findOne({
                        where: { [pkName]: generatedId },
                        attributes: [pkName],
                    }));
                    if (!exists) {
                        body[pkName] = generatedId;
                        found = true;
                        break;
                    }
                }
                // ID space exhausted → server design failure
                if (!found) {
                    throw new errors_1.InternalError("common.errors.idSpaceExhausted");
                }
            }
        }
        // ---------------------------------------------------------------------
        // apply transform (if existed)
        const finalData = options?.transform ? await options.transform(body) : body;
        // ---------------------------------------------------------------------
        // non-duplicate checks (run AFTER transform so normalized values are checked)
        if (options?.nonDuplicateFields) {
            for (const field of options.nonDuplicateFields) {
                const value = finalData?.[field];
                if (value == null || value === "")
                    continue;
                const exists = (await model.findOne({
                    where: { [field]: value },
                    attributes: [field],
                }));
                if (exists) {
                    throw new errors_1.ConflictError("common.errors.validation.duplicate");
                }
            }
        }
        await model.create(finalData);
        // ---------------------------------------------------------------
    }
    catch (error) {
        // ---------------------------------------------------------------------
        // centralized error mapping
        if (error instanceof errors_1.ValidationError || error instanceof errors_1.ConflictError || error instanceof errors_1.InternalError) {
            throw error;
        }
        if (error instanceof sequelize_1.UniqueConstraintError) {
            throw new errors_1.ConflictError("common.errors.validation.duplicate");
        }
        console.error("DB create failed:", error);
        throw new errors_1.InternalError("common.errors.internal");
    }
};
exports.add = add;
//# sourceMappingURL=add.js.map