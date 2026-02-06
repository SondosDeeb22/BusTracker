//===================================================================================================
//? Types
//===================================================================================================

import type { Model, ModelStatic } from "sequelize";

export type EnumFieldRule = {
    field: string;
    enumObj: object;
    optional?: boolean;
};

export type UserHelperAddOptions = {
    nonDuplicateFields?: string[];
    enumFields?: EnumFieldRule[];
    transform?: (data: Record<string, unknown>) => Promise<Record<string, unknown>> | Record<string, unknown>;
};

export type UserHelperUpdateOptions = {
    nonDuplicateFields?: string[];
    enumFields?: EnumFieldRule[];
    disallowFields?: string[];
    transform?: (vals: Record<string, unknown>) => Promise<Record<string, unknown>> | Record<string, unknown>;
};

export type UserHelperModel = ModelStatic<Model>;
