//import helper 
import type { Model, ModelStatic } from "sequelize";

import { add as addImpl } from "./userHelper/add";
import { remove as removeImpl } from "./userHelper/remove";
import { update as updateImpl } from "./userHelper/update";

//===================================================================================================================================================
//===================================================================================================================================================



export class UserHelper{
    //?==========================================================================================================
    //? function to ADD data
    //========================================================================================================

    async add(
    model: ModelStatic<Model<any, any>>,
    payload: Record<string, any>,
    options?: {
        nonDuplicateFields?: string[],
        enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
        transform?: (data: any) => Promise<any> | any;
    }
    ): Promise<void> {

        const mappedOptions: {
            nonDuplicateFields?: string[];
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            transform?: (data: Record<string, unknown>) => Promise<Record<string, unknown>> | Record<string, unknown>;
        } = {};

        if (options?.nonDuplicateFields) mappedOptions.nonDuplicateFields = options.nonDuplicateFields;
        if (options?.enumFields) mappedOptions.enumFields = options.enumFields;
        if (options?.transform) {
            mappedOptions.transform = options.transform as unknown as (data: Record<string, unknown>) =>
                Promise<Record<string, unknown>> | Record<string, unknown>;
        }

        await addImpl(
            model as unknown as ModelStatic<Model>,
            payload as unknown as Record<string, unknown>,
            options ? mappedOptions : undefined
        );
    }







    //?==========================================================================================================
    //? function to Remove data
    //==========================================================================================================
 
    async remove(model: ModelStatic<Model<any, any>>, uniqueField: string, uniqueValue: string):Promise<number>{
        return removeImpl(model as unknown as ModelStatic<Model>, uniqueField, uniqueValue);
    }

    //?==========================================================================================================
    //? function to Update data
    //==========================================================================================================
    
    async update(model: ModelStatic<Model<any, any>>, values: Record<string, any>,
        options?: {
            nonDuplicateFields?: string[];
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            disallowFields?: string[];
            transform?: (vals: any) => Promise<any> | any;
        }
    ):Promise<{ updated: boolean; updatedCount: number }>{

        const mappedOptions: {
            nonDuplicateFields?: string[];
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            disallowFields?: string[];
            transform?: (vals: Record<string, unknown>) => Promise<Record<string, unknown>> | Record<string, unknown>;
        } = {};

        if (options?.nonDuplicateFields) mappedOptions.nonDuplicateFields = options.nonDuplicateFields;
        if (options?.enumFields) mappedOptions.enumFields = options.enumFields;
        if (options?.disallowFields) mappedOptions.disallowFields = options.disallowFields;
        if (options?.transform) {
            mappedOptions.transform = options.transform as unknown as (vals: Record<string, unknown>) =>
                Promise<Record<string, unknown>> | Record<string, unknown>;
        }

        return updateImpl(
            model as unknown as ModelStatic<Model>,
            values as unknown as Record<string, unknown>,
            options ? mappedOptions : undefined
        );
    }
}
