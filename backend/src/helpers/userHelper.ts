//import libraries
import {Request, Response} from 'express';
// import exceptions
import { sendResponse } from "../exceptions/messageTemplate";

//import helper 
import { validateEnum } from './validateEnumValue';
import { Model, ModelStatic } from 'sequelize';

//import Enums ------------------------------------------------------------------------------
import { tokenNames } from "../enums/tokenNameEnum";

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
        
        options?: { //optional hook you can pass in `options.transform` to modify the request body before saving.
            nonDuplicateFields?: string[],
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            transform?: (data: any) => Promise<any> | any;
            skipResponse?: boolean; // Add option to skip sending response
        }
    ): Promise<void>{ ///=====================================================================

        const modelClassName = model.name;

        const dataName = (modelClassName?.replace(/Model$/,'') || '').toLowerCase(); // remove the word 'Model' from the name 
   
        try {
            const body = (payload ?? req.body) as Record<string, any>;

            // get required/unique from model metadata when not provided
            const attrs = model.getAttributes();

            const requiredFromModel: string[] = [];

            // Organize model attributes( attrs ) to required/ unique fields -----------------------------------------------
            // destruct each entry in attrs to {name: attr} pairs
            for (const [name, attr] of Object.entries(attrs)) {
                
                //* take required columns: not nullable, no default, no auto increment, no primary key
                const allowNull = (attr as any).allowNull === true;
                const hasDefault = (attr as any).defaultValue !== undefined;
                const autoInc = (attr as any).autoIncrement === true;
                const isPK = (attr as any).primaryKey === true;


                if (!allowNull && !hasDefault && !autoInc && !isPK) {
                    requiredFromModel.push(name);
                }
            }
            //---------------------------------------------------------------------------------  

            const requiredFields = requiredFromModel;

            // take the provided inputs and ensure all fields provided ==========================================================
            for (const field of requiredFields) {
                if (body[field] === undefined || body[field] === null || body[field] === "") {
                    sendResponse(res, 500, `Fill all Fields please: missing ${field}`);
                    return;
                }
            }
            // =============================================================================================================

            // Enum validation
            if (options?.enumFields && options.enumFields.length > 0) {
                for (const rule of options.enumFields) {
                    const value = body[rule.field];
                    if (value === undefined || value === null || value === "") {
                        if (!rule.optional) {
                            sendResponse(res, 500, `Invalid ${rule.field}!`);
                            return;
                        }
                    } else if (!validateEnum(value, rule.enumObj as any)) {
                        sendResponse(res, 500, `Invalid ${rule.field}!`);
                        return;
                    }
                }
            }
            

            // =============================================================================================================
            // Primary Key settings

            const pkEntry = Object.entries(attrs).find(([_, a]) => (a as any).primaryKey === true);
            
            if (pkEntry) {
                const [pkName, pkAttr] = pkEntry as [string, any];
                const hasPk = body[pkName] !== undefined && body[pkName] !== null && body[pkName] !== "";
                const autoInc = pkAttr.autoIncrement === true;
                const hasDefault = pkAttr.defaultValue !== undefined;


                // Auto-generate primary key if needed
                if (!hasPk && !autoInc && !hasDefault) {

                    const modelName = model.name.toLocaleUpperCase()[0];

                    let id: number;
                    let unique: Model[];
                    do{
                        id = Math.floor(100 + Math.random() * 900);// generate  id

                        // check that id is not used before
                        unique = await model.findAll({
                            where: {
                                id: id
                            }
                        })
                    }
                    while(unique.length !== 0);

                    const finalId = `${modelName}${id}`;
                    body[pkName] = finalId;

                }
            }


            // =============================================================================================================
            // check if the special value already exists 
            //special key is a normal key in model (not PK) that must be unique (can't be duplicated)

            if(options?.nonDuplicateFields && options.nonDuplicateFields.length > 0){
                    for(const field of options.nonDuplicateFields){
                        const dubplicated= await model.findOne({
                            where:{
                                [field]: body[field]
                            }
                        })

                        // Check that field value is not used in the database before 
                        if(dubplicated){
                            sendResponse(res, 500, `a ${dataName} was not Added, because a ${dataName} with the same ${field} already exists!`);
                            return;
                        }
                    }
            }



            // =============================================================================================================
            // Optional transform (used for hash password, or to normalize data)
            const finalData = options?.transform ? await options.transform(body) : body;

            await model.create(finalData as any);

            const success = `${dataName} was Added successfully`;
            if (!options?.skipResponse) {
                sendResponse(res, 200, success);
            }
            console.log(success);
            return;

        //---------------------------------------------------------------------------------------------------------------------------------------
        } catch (error) {
            sendResponse(res, 500, `Error Found while creating ${dataName}. ${error}`);
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
                sendResponse(res, 500, `No ${uniqueField} were found`);
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
                sendResponse(res, 500, `No ${dataName} found with this ${uniqueField}!`);
                return;
            }

            // Delete the user from the database ---------------------------------------------------
            const deletedField = await  model.destroy({
                where:{
                    [uniqueField]: uniqueValue,
                }
            });

            if(deletedField === 0 ){
                sendResponse(res, 500, `Field wasn't removed. Ensure you entered correct ${uniqueField}`);
                return;
            }

            //if the user was removed 
            sendResponse(res, 200, `${dataName} was successfully Removed`);
            return;
            // ======================================================================
        }catch(error){
            sendResponse(res, 500, `Error occured while removing ${dataName}. ${error}`);
            return;
        }

    }

    //?==========================================================================================================
    //? function to Update data
    //==========================================================================================================

    // async update( req: Request, res: Response, model: ModelStatic<Model<any, any>>, uniqueField: string, uniqueValue: any, values: Record<string, any>,
    
    async update( req: Request, res: Response, model: ModelStatic<Model<any, any>>, values: Record<string, any>,
        options?: {
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            disallowFields?: string[];
            transform?: (vals: any) => Promise<any> | any;
            successMessage?: string;
        }
    ):Promise<void>{
        
        //get the name of the model
        const modelClassName = model.name;
        const dataName = (modelClassName?.replace(/Model$/,'') || '').toLowerCase();

        try{

            const body= req.body;

            const uniqueField = 'id';
            const uniqueValue = body.id;
  
            // check that uniqueValue is not empty --------------------------------------------------
            if(uniqueValue === undefined || uniqueValue === null || uniqueValue === ""){
                sendResponse(res, 500, `No ${uniqueField} were found`);
                return;
            }
            //check that updated values exists 
            if(!values || Object.keys(values).length === 0){
                    sendResponse(res, 500, "Please provide the data!");
                return;
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
                        sendResponse(res, 500, `Invalid ${rule.field}!`);
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
                sendResponse(res, 500, `No ${dataName} found with this ${uniqueField}!`);
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
                sendResponse(res, 200, `${dataName} is already up to date (no changes detected)`);
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
                sendResponse(res, 500, `${dataName} wasn't updated. Please verify the provided fields.`);
                    return;
                }
            sendResponse(res, 200, `${dataName} was updated successfully`);
            return;

            //===================================================================================
            }catch(error){
                sendResponse(res, 500, `Error occured while updatein ${dataName}.  ${error}`);
                return;
            }
        }
}
