//===================================================================================================
//? Import Sections
//===================================================================================================

import type { Model } from "sequelize";
import { Op } from "sequelize";

import { validateEnum } from "../validateEnumValue";

import { ConflictError, NotFoundError, ValidationError } from "../../errors";

import type { UserHelperModel, UserHelperUpdateOptions } from "./types";

//===================================================================================================
//? function to Update data
//===================================================================================================

export const update = async (
    model: UserHelperModel,
    values: Record<string, unknown>,
    options?: UserHelperUpdateOptions
): Promise<{ updated: boolean; updatedCount: number }> => {
    //get the name of the model
    const modelClassName = model.name;
    const dataName = (modelClassName?.replace(/Model$/, "") || "").toLowerCase();

    try {
        const attrsForPk = model.getAttributes();
        const pkEntry = Object.entries(attrsForPk).find(([_, a]) => (a as unknown as { primaryKey?: boolean }).primaryKey === true);
        const uniqueField = pkEntry ? (pkEntry[0] as string) : "id";
        const uniqueValue = values?.[uniqueField];

        // check that uniqueValue is not empty --------------------------------------------------
        if (uniqueValue === undefined || uniqueValue === null || uniqueValue === "") {
            throw new ValidationError("common.errors.validation.fillAllFields");
        }

        //check that updated values exists
        if (!values || Object.keys(values).length === 0) {
            throw new ValidationError("common.errors.validation.fillAllFields");
        }

        // normalize empty strings to null for nullable columns -------------------------------------
        const attrs = model.getAttributes();

        for (const [name, attr] of Object.entries(attrs)) {
            const allowNull = (attr as unknown as { allowNull?: boolean }).allowNull === true;
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
                if (!hasField) continue;

                // If the client sent it, enforce requiredness/validity.
                if ((value === undefined || value === null || value === "") && !rule.optional) {
                    throw new ValidationError("common.errors.validation.missingField");
                }
                if (value != null && value !== "") {
                    if (typeof value !== "string" && typeof value !== "number") {
                        throw new ValidationError("common.errors.validation.invalidField");
                    }
                    if (!validateEnum(value, rule.enumObj as Record<string, string | number>)) {
                        throw new ValidationError("common.errors.validation.invalidField");
                    }
                }
            }
        }

        //check reocred exists --------------------------------------------------------------------
        const record = await model.findOne({
            where: {
                [uniqueField]: uniqueValue,
            } as unknown as Record<string, unknown>,
            attributes: [uniqueField],
        });

        if (!record) {
            throw new NotFoundError("common.errors.notFound");
        }

        //----------------------------------------------------------------------------------------------
        //apply transform (if exists)

        const finalUpdates = options?.transform ? await options.transform(values) : values;

        const current = (await model.findOne({
            where: { [uniqueField]: uniqueValue } as unknown as Record<string, unknown>,
            attributes: Object.keys(finalUpdates),
        })) as Model | null;

        const keys = Object.keys(finalUpdates);

        const changedKeys = keys.filter((k) => {
            const currVal = (current as unknown as { get?: (key: string) => unknown })?.get
                ? (current as unknown as { get: (key: string) => unknown }).get(k)
                : (current as unknown as Record<string, unknown>)?.[k];

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
                if (!changedKeys.includes(field)) continue;

                const value = finalUpdates[field];
                if (value == null || value === "") continue;

                const duplicate = await model.findOne({
                    where: {
                        [field]: value,
                        [uniqueField]: { [Op.ne]: uniqueValue },
                    } as unknown as Record<string, unknown>,
                    attributes: [uniqueField],
                });

                if (duplicate) {
                    throw new ConflictError("common.errors.validation.duplicate");
                }
            }
        }

        //------------------------------------------------------------------------------------------
        //prepare updates to apply

        const updatesToApply: Record<string, unknown> = {};

        for (const key of changedKeys) updatesToApply[key] = finalUpdates[key];

        const [updatedCount] = await model.update(updatesToApply as never, {
            where: {
                [uniqueField]: uniqueValue,
            } as unknown as Record<string, unknown>,
        });

        if (updatedCount === 0) {
            throw new ConflictError("common.crud.notUpdated");
        }

        return { updated: true, updatedCount };

        //===================================================================================
    } catch (error: unknown) {
        console.error(`Error occured while updating ${dataName}.`, error);
        throw error;
    }
};
