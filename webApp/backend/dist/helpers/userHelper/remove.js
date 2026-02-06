"use strict";
//===================================================================================================
//? Import Sections
//===================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = void 0;
const errors_1 = require("../../errors");
//===================================================================================================
//? function to Remove data
//===================================================================================================
const remove = async (model, uniqueField, uniqueValue) => {
    // unique value is basically the primary key of the model
    const modelClassName = model.name;
    const dataName = (modelClassName?.replace(/Model$/, "") || "").toLowerCase();
    try {
        if (!uniqueValue) {
            throw new errors_1.ValidationError("common.errors.missingField");
        }
        //ensure the user exists -----------------------------------------------------
        const fieldExists = await model.findOne({
            where: {
                [uniqueField]: uniqueValue,
            },
            attributes: [uniqueField],
        });
        if (!fieldExists) {
            throw new errors_1.NotFoundError("common.errors.notFound");
        }
        // Delete the user from the database ---------------------------------------------------
        const deletedField = await model.destroy({
            where: {
                [uniqueField]: uniqueValue,
            },
        });
        if (deletedField === 0) {
            throw new errors_1.ConflictError("common.crud.notRemoved");
        }
        //if the user was removed
        return deletedField;
        // ------------------------------------------------------------------------
    }
    catch (error) {
        console.error(`Error occured while removing ${dataName}.`, error);
        throw error;
    }
};
exports.remove = remove;
//# sourceMappingURL=remove.js.map