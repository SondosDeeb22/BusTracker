//import libraries
import {Request, Response} from 'express';
// import exceptions
import { sendResponse } from "../exceptions/messageTemplate";

//import helper 
import { validateEnum } from './validateEnumValue';
import { Model, ModelStatic, UniqueConstraintError } from 'sequelize';

//import Enums ------------------------------------------------------------------------------

// import interfaces ------------------------------------------------------------------------
import { JWTdata } from "../interfaces/helper&middlewareInterface";

// import helpers --------------------------------------------------------------------
import AuthHelper from "../helpers/authHelpher";
const authHelper = new AuthHelper();

//===================================================================================================================================================
//===================================================================================================================================================



export class UserHelper{
    //?==========================================================================================================
    //? function to ADD data
    //==========================================================================================================

    async add(
        req: Request,
        res: Response,
        model: ModelStatic<Model<any, any>>,
        payload: Record<string, any>,

        options?: {
            nonDuplicateFields?: string[],
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            transform?: (data: any) => Promise<any> | any;
            successMessageKey?: string;
        }
    ): Promise<void> {
        //----------------------------------------------------------------

        const modelClassName = model.name;
        const dataName = (modelClassName?.replace(/Model$/,'') || '').toLowerCase();

        try {
            const body = (payload ?? req.body) as Record<string, any>;

            // get required/unique from model metadata when not provided
            const attrs = model.getAttributes();

            const requiredFromModel: string[] = [];

            // collect required fields
            for (const [name, attr] of Object.entries(attrs)) {
                const allowNull = (attr as any).allowNull === true;
                const hasDefault = (attr as any).defaultValue !== undefined;
                const autoInc = (attr as any).autoIncrement === true;
                const isPK = (attr as any).primaryKey === true;

                if (!allowNull && !hasDefault && !autoInc && !isPK) {
                    requiredFromModel.push(name);
                }
            }

            const requiredFields = requiredFromModel;

            for (const field of requiredFields) {
                if (body[field] === undefined || body[field] === null || body[field] === "") {
                    const status = 500;
                    sendResponse(res, status, 'common.validation.fillAllFields');
                    return; 
                }
            }

            // normalize empty strings to null for nullable columns
            for(const field in body) {
                if(!requiredFields.includes(field) && body[field] === "" ) { // to ensure column field is optional and it's empty string, so we make it Null
                    body[field] = null;
                }
            }

            // Enum validation
            if (options?.enumFields && options.enumFields.length > 0) {
                for (const rule of options.enumFields) {
                    const value = body[rule.field];
                    if (value === undefined || value === null || value === "") {
                        if (!rule.optional) {
                            const status = 500;
                            sendResponse(res, status, 'common.validation.invalidField');
                            return;
                        }
                    } else if (!validateEnum(value, rule.enumObj as any)) {
                        const status = 500;
                        sendResponse(res, status, 'common.validation.invalidField');
                        return;
                    }
                }
            }

            // Primary Key settings --------------------------------------------------------------------------------

            const pkEntry = Object.entries(attrs).find(([_, a]) => (a as any).primaryKey === true);

            if (pkEntry) {
                const [pkName, pkAttr] = pkEntry as [string, any];
                // pkName is the actual primary-key column name for the given model (e.g. 'scheduleId', 'busId', ...)
                // We avoid assuming a generic 'id' column because different tables might use different PK names
                const hasPk = body[pkName] !== undefined && body[pkName] !== null && body[pkName] !== "";
                const autoInc = pkAttr.autoIncrement === true;
                const hasDefault = pkAttr.defaultValue !== undefined;

                if (!hasPk && !autoInc && !hasDefault) {
                    // If the PK isn't provided, isn't auto-increment, and has no default value,
                    //we generate a new PK value using the model name prefix(First letter) + next numeric suffix.
                    const modelName = model.name.toLocaleUpperCase()[0];

                    // Deterministic collision-safe generation:
                    // Try IDs from 100 -> 999 and pick the first one that does NOT exist in DB
                    // This keeps the old behavior of "check if used before" without randomness
                    let finalId = '';
                    for (let n = 100; n <= 999; n++) {
                        const candidate = `${modelName}${String(n).padStart(3, '0')}`;
                        const exists = await model.findOne({
                            where: { [pkName]: candidate } as any,
                            attributes: [pkName],
                        });

                        if (!exists) {
                            finalId = candidate;
                            break;
                        }
                    }

                    if (!finalId) {
                        console.error('Cannot generate a new primary key. ID space is exhausted.');
                        sendResponse(res, 500, 'common.errors.internal');
                        return;
                    }

                    body[pkName] = finalId;
                }
            }
            //-----------------------------------------------------------------------------------------------------

            // non-duplicate checks -----------------------------------------------------------------------------
            if (options?.nonDuplicateFields && options.nonDuplicateFields.length > 0) {
                for (const field of options.nonDuplicateFields) {
                    const duplicated = await model.findOne({
                        where: { [field]: body[field] }
                    });

                    if (duplicated) {
                        const status = 500;
                        sendResponse(res, status, 'common.validation.duplicate');
                        return;
                    }
                }
            }
            //-----------------------------------------------------------------------------------------------------

            // apply transform (if existed) and create
            const finalData = options?.transform ? await options.transform(body) : body;
            await model.create(finalData as any);

            sendResponse(res, 200, options?.successMessageKey ?? 'common.crud.added');
            console.log(`${dataName} was added successfully`);

            return;

        //==========================================================================================================
        } catch (error) {sendResponse
            console.error(`Error occured while creating ${dataName}.`, error);
            sendResponse(res, 500, 'common.errors.internal');
            return;
        }
    }


    //?==========================================================================================================
    //? function to Remove data
    //==========================================================================================================
 
    async remove(req: Request, res: Response, model: ModelStatic<Model<any, any>>, uniqueField: string, uniqueValue: string):Promise<void>{
  
        const modelClassName = model.name;

        const dataName = (modelClassName?.replace(/Model$/,'') || '').toLowerCase(); // remove the word 'Model' from the name 
   
        try{      
                
            if(!uniqueValue){
                sendResponse(res, 500, 'common.validation.required');
                return;
            }
            //ensure the user exists -----------------------------------------------------
            const fieldExists = await model.findOne({
                where:{
                    [uniqueField] : uniqueValue
                },
                attributes: [uniqueField]
            });
            
            if(!fieldExists){
                sendResponse(res, 500, 'common.crud.notFound');
                return;
            }

            // Delete the user from the database ---------------------------------------------------
            const deletedField = await  model.destroy({
                where:{
                    [uniqueField]: uniqueValue,
                }
            });

            if(deletedField === 0 ){
                sendResponse(res, 500, 'common.crud.notRemoved');
                return;
            }

            //if the user was removed 
            sendResponse(res, 200, 'common.crud.removed');
            return;
            // ======================================================================
        }catch(error){
            console.error(`Error occured while removing ${dataName}.`, error);
            sendResponse(res, 500, 'common.errors.internal');
            return;
        }

    }

    //?==========================================================================================================
    //? function to Update data
    //==========================================================================================================
    
    async update( req: Request, res: Response, model: ModelStatic<Model<any, any>>, values: Record<string, any>,
        options?: {
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            disallowFields?: string[];
            transform?: (vals: any) => Promise<any> | any;
        }
    ):Promise<void>{
        
        //get the name of the model
        const modelClassName = model.name;
        const dataName = (modelClassName?.replace(/Model$/,'') || '').toLowerCase();

        try{

            const body= req.body;

            const attrsForPk = model.getAttributes();
            const pkEntry = Object.entries(attrsForPk).find(([_, a]) => (a as any).primaryKey === true);
            const uniqueField = pkEntry ? (pkEntry[0] as string) : 'id';
            const uniqueValue = body?.[uniqueField] ?? values?.[uniqueField];
  
            // check that uniqueValue is not empty --------------------------------------------------
            if(uniqueValue === undefined || uniqueValue === null || uniqueValue === ""){
                sendResponse(res, 500, 'common.validation.required');
                return;
            }
            //check that updated values exists 
            if(!values || Object.keys(values).length === 0){
                    sendResponse(res, 500, 'common.validation.noData');
                return;
            }

            // normalize empty strings to null for nullable columns -------------------------------------
            const attrs = model.getAttributes();
            
            for (const [name, attr] of Object.entries(attrs)) {

                const allowNull = (attr as any).allowNull === true;
                const value = (values as any)[name];

                if (allowNull && typeof value === 'string' && value.trim() === '') {
                    (values as any)[name] = null;
                }
            }

            // Enum validation --------------------------------------------------------------------------
            if (options?.enumFields && options.enumFields.length > 0) {
                for (const rule of options.enumFields) {
                    const value = values[rule.field];
                    if (value === undefined || value === null || value === "") {
                        if (!rule.optional) {
                            continue;
                        }
                    } else if (!validateEnum(value, rule.enumObj as any)) {
                        sendResponse(res, 500, 'common.validation.invalidField');
                        return;
                    }
                }
            }


            //check reocred exists --------------------------------------------------------------------
            const record = await model.findOne({
                    where:{
                    [uniqueField]: uniqueValue
                },
                attributes: [uniqueField]
            });

            if(!record){
                sendResponse(res, 500, 'common.crud.notFound');
                return;
            }

            //----------------------------------------------------------------------------------------------
            //apply transform (if exists)

            const finalUpdates = options?.transform ? await options.transform(values) : values;

            const current = await model.findOne({
                where: { [uniqueField]: uniqueValue },
                attributes: Object.keys(finalUpdates)
            });


            const keys = Object.keys(finalUpdates);

            const changedKeys = keys.filter(k => {
                const currVal = (current as any)?.get ? (current as any).get(k) : (current as any)?.[k];
                const newVal = (finalUpdates as any)[k];
                return currVal !== newVal;
            });


            if (changedKeys.length === 0) {
                sendResponse(res, 200, 'common.crud.noChanges');
                return;
            }
            

            //------------------------------------------------------------------------------------------
            //prepare updates to apply
            const updatesToApply: Record<string, any> = {};

            for (const key of changedKeys) updatesToApply[key] = (finalUpdates as any)[key];
            const [updatedCount] = await model.update(updatesToApply, {
                where:{
                    [uniqueField]: uniqueValue
                    }
                });
            if(updatedCount === 0){
                sendResponse(res, 500, 'common.crud.notUpdated');
                    return;
                }
            sendResponse(res, 200, 'common.crud.updated');
            return;

            //===================================================================================
            }catch(error){

                console.error(`Error occured while updating ${dataName}.`, error);
                sendResponse(res, 500, 'common.errors.internal');
                return;
            }
        }
}
