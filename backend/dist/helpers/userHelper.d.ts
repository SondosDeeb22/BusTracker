import { Request, Response } from 'express';
import { Model, ModelStatic } from 'sequelize';
export declare class UserHelper {
    add(req: Request, res: Response, model: ModelStatic<Model<any, any>>, payload: Record<string, any>, options?: {
        nonDuplicateFields?: string[];
        enumFields?: Array<{
            field: string;
            enumObj: object;
            optional?: boolean;
        }>;
        transform?: (data: any) => Promise<any> | any;
        skipResponse?: boolean;
    }): Promise<void>;
    remove(req: Request, res: Response, model: ModelStatic<Model<any, any>>, uniqueField: string, uniqueValue: string): Promise<void>;
    update(req: Request, res: Response, model: ModelStatic<Model<any, any>>, values: Record<string, any>, options?: {
        enumFields?: Array<{
            field: string;
            enumObj: object;
            optional?: boolean;
        }>;
        disallowFields?: string[];
        transform?: (vals: any) => Promise<any> | any;
        successMessage?: string;
    }): Promise<void>;
}
//# sourceMappingURL=userHelper.d.ts.map