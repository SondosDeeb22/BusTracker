//===================================================================================================
//? Import Sections
//===================================================================================================

import { ConflictError, NotFoundError, ValidationError } from "../../errors";

import type { UserHelperModel } from "./types";

//===================================================================================================
//? function to Remove data
//===================================================================================================

export const remove = async (
    model: UserHelperModel,
    uniqueField: string,
    uniqueValue: string
): Promise<number> => {
    // unique value is basically the primary key of the model

    const modelClassName = model.name;
    const dataName = (modelClassName?.replace(/Model$/, "") || "").toLowerCase();

    try {
        if (!uniqueValue) {
            throw new ValidationError("common.errors.missingField");
        }

        //ensure the user exists -----------------------------------------------------
        const fieldExists = await model.findOne({
            where: {
                [uniqueField]: uniqueValue,
            } as unknown as Record<string, unknown>,
            attributes: [uniqueField],
        });

        if (!fieldExists) {
            throw new NotFoundError("common.errors.notFound");
        }

        // Delete the user from the database ---------------------------------------------------
        const deletedField = await model.destroy({
            where: {
                [uniqueField]: uniqueValue,
            } as unknown as Record<string, unknown>,
        });

        if (deletedField === 0) {
            throw new ConflictError("common.crud.notRemoved");
        }

        //if the user was removed
        return deletedField;

        // ------------------------------------------------------------------------
    } catch (error: unknown) {
        console.error(`Error occured while removing ${dataName}.`, error);
        throw error;
    }
};
