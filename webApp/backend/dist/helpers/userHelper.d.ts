import type { Model, ModelStatic } from "sequelize";
export declare class UserHelper {
    add(model: ModelStatic<Model<any, any>>, payload: Record<string, any>, options?: {
        nonDuplicateFields?: string[];
        enumFields?: Array<{
            field: string;
            enumObj: object;
            optional?: boolean;
        }>;
        transform?: (data: any) => Promise<any> | any;
    }): Promise<void>;
    remove(model: ModelStatic<Model<any, any>>, uniqueField: string, uniqueValue: string): Promise<number>;
    update(model: ModelStatic<Model<any, any>>, values: Record<string, any>, options?: {
        nonDuplicateFields?: string[];
        enumFields?: Array<{
            field: string;
            enumObj: object;
            optional?: boolean;
        }>;
        disallowFields?: string[];
        transform?: (vals: any) => Promise<any> | any;
    }): Promise<{
        updated: boolean;
        updatedCount: number;
    }>;
}
//# sourceMappingURL=userHelper.d.ts.map