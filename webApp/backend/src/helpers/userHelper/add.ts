//===================================================================================================
//? Import Sections
//===================================================================================================

import type { Model } from "sequelize";
import { UniqueConstraintError } from "sequelize";

import { validateEnum } from "../validateEnumValue";

import { ConflictError, InternalError, ValidationError } from "../../errors";

import type { UserHelperAddOptions, UserHelperModel } from "./types";

//===================================================================================================
//? function to ADD data
//===================================================================================================

export const add = async (
    model: UserHelperModel,
    payload: Record<string, unknown>,
    options?: UserHelperAddOptions
): Promise<void> => {
    const attrs = model.getAttributes();
    const body: Record<string, unknown> = { ...payload };

    try {
        // ---------------------------------------------------------------------
        // required fields (from model metadata)

        const requiredFields: string[] = [];

        for (const [name, attr] of Object.entries(attrs)) {
            const a = attr as unknown as {
                allowNull?: boolean;
                defaultValue?: unknown;
                autoIncrement?: boolean;
                primaryKey?: boolean;
            };

            if (!a.allowNull && a.defaultValue === undefined && !a.autoIncrement && !a.primaryKey) {
                requiredFields.push(name);
            }
        }

        for (const field of requiredFields) {
            if (body[field] === undefined || body[field] === null || body[field] === "") {
                throw new ValidationError("common.errors.validation.fillAllFields");
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

        // ---------------------------------------------------------------------
        // primary key generation

        const pkEntry = Object.entries(attrs).find(([_, a]) => (a as unknown as { primaryKey?: boolean }).primaryKey);

        if (pkEntry) {
            const [pkName, pkAttr] = pkEntry as [string, unknown];
            const pkAttrTyped = pkAttr as {
                autoIncrement?: boolean;
                defaultValue?: unknown;
            };

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
                        where: { [pkName]: generatedId } as unknown as Record<string, unknown>,
                        attributes: [pkName],
                    })) as Model | null;

                    if (!exists) {
                        body[pkName] = generatedId;
                        found = true;
                        break;
                    }
                }

                // ID space exhausted → server design failure
                if (!found) {
                    throw new InternalError("common.errors.idSpaceExhausted");
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
                if (value == null || value === "") continue;

                const exists = (await model.findOne({
                    where: { [field]: value } as unknown as Record<string, unknown>,
                    attributes: [field],
                })) as Model | null;

                if (exists) {
                    throw new ConflictError("common.errors.validation.duplicate");
                }
            }
        }

        await model.create(finalData as never);

        // ---------------------------------------------------------------
    } catch (error: unknown) {
        // ---------------------------------------------------------------------
        // centralized error mapping

        if (error instanceof ValidationError || error instanceof ConflictError || error instanceof InternalError) {
            throw error;
        }

        if (error instanceof UniqueConstraintError) {
            throw new ConflictError("common.errors.validation.duplicate");
        }

        console.error("DB create failed:", error);
        throw new InternalError("common.errors.internal");
    }
};
