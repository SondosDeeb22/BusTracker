//import helper 
import { validateEnum } from './validateEnumValue';
import { Model, ModelStatic, UniqueConstraintError } from 'sequelize';

//import Enums ------------------------------------------------------------------------------

import { ConflictError, NotFoundError, ValidationError, InternalError } from "../errors";
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

        const attrs = model.getAttributes();
        const body = { ...payload };

        try {
            // ---------------------------------------------------------------------
            // required fields (from model metadata)

            const requiredFields: string[] = [];

            for (const [name, attr] of Object.entries(attrs)) {
                const a = attr as any;
                if (!a.allowNull && a.defaultValue === undefined && !a.autoIncrement && !a.primaryKey) {
                    requiredFields.push(name);
                }
            }

            for (const field of requiredFields) {
                if (body[field] === undefined || body[field] === null || body[field] === "") {
                    throw new ValidationError('common.errors.validation.fillAllFields');
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
                        throw new ValidationError('common.errors.validation.missingField');
                    }
                    if (value != null && !validateEnum(value, rule.enumObj as any)) {
                        throw new ValidationError('common.errors.validation.invalidField');
                    }
                }
            }

            // ---------------------------------------------------------------------
            // primary key generation

            const pkEntry = Object.entries(attrs).find(([_, a]) => (a as any).primaryKey);

            if (pkEntry) {
                const [pkName, pkAttr] = pkEntry as [string, any];
                const hasPk = body[pkName] != null && body[pkName] !== "";

        
                // If the PK isn't provided, isn't auto-increment, and has no default value,
                //we generate a new PK value using the model name prefix(First letter) + next numeric suffix
                if (!hasPk && !pkAttr.autoIncrement && pkAttr.defaultValue === undefined) {

                    const prefix = model.name.toUpperCase()[0];
                    let generatedId: string | null = null;
                    let found = false;

                    // Deterministic collision-safe generation:
                    // Try IDs from 100 -> 999 and pick the first one that does NOT exist in DB
                    for (let n = 100; n <= 999; n++) {
                        generatedId = `${prefix}${String(n).padStart(3, '0')}`;
                        const exists = await model.findOne({
                            where: { [pkName]: generatedId } as any,
                            attributes: [pkName],
                        });

                        if (!exists) {
                            body[pkName] = generatedId;
                            found = true;
                            break;
                        }
                    }

                    // ID space exhausted → server design failure
                    if (!found) {
                        throw new InternalError('common.errors.idSpaceExhausted');
                    }
                }
            }

            // ---------------------------------------------------------------------
            // apply transform (if existed) and create and Create record in the database
            // 
            const finalData = options?.transform
                ? await options.transform(body)
                : body;

            // ---------------------------------------------------------------------
            // non-duplicate checks (run AFTER transform so normalized values are checked)
            if (options?.nonDuplicateFields) {
                for (const field of options.nonDuplicateFields) {
                    const value = (finalData as any)?.[field];
                    if (value == null || value === '') continue;

                    const exists = await model.findOne({
                        where: { [field]: value } as any,
                        attributes: [field],
                    });

                    if (exists) {
                        throw new ConflictError('common.errors.validation.duplicate');
                    }
                }
            }

            await model.create(finalData as any);

        // ---------------------------------------------------------------
        } catch (error) {

            // ---------------------------------------------------------------------
            // centralized error mapping
            if (
                error instanceof ValidationError ||
                error instanceof ConflictError ||
                error instanceof InternalError
            ) {
                throw error;
            }

            if (error instanceof UniqueConstraintError) {
                throw new ConflictError('common.errors.validation.duplicate');
            }

            console.error('DB create failed:', error);
            throw new InternalError('common.errors.internal');
        }
    }







    //?==========================================================================================================
    //? function to Remove data
    //==========================================================================================================
 
    async remove(model: ModelStatic<Model<any, any>>, uniqueField: string, uniqueValue: string):Promise<number>{
        // unique value is basically the primary key of the model
  
        const modelClassName = model.name;

        const dataName = (modelClassName?.replace(/Model$/,'') || '').toLowerCase(); // remove the word 'Model' from the name 
   
        try{      
            if(!uniqueValue){
                throw new ValidationError('common.errors.missingField');
            }
            //ensure the user exists -----------------------------------------------------
            const fieldExists = await model.findOne({
                where:{
                    [uniqueField] : uniqueValue
                },
                attributes: [uniqueField]
            });
            
            if(!fieldExists){
                throw new NotFoundError('common.errors.notFound');
            }

            // Delete the user from the database ---------------------------------------------------
            const deletedField = await  model.destroy({
                where:{
                    [uniqueField]: uniqueValue,
                }
            });

            if(deletedField === 0 ){
                throw new ConflictError('common.crud.notRemoved');
            }

            //if the user was removed 
            return deletedField;
            // ------------------------------------------------------------------------
        }catch(error){
            console.error(`Error occured while removing ${dataName}.`, error);
            throw error;
        }

    }

    //?==========================================================================================================
    //? function to Update data
    //==========================================================================================================
    
    async update(model: ModelStatic<Model<any, any>>, values: Record<string, any>,
        options?: {
            enumFields?: Array<{ field: string; enumObj: object; optional?: boolean }>;
            disallowFields?: string[];
            transform?: (vals: any) => Promise<any> | any;
        }
    ):Promise<{ updated: boolean; updatedCount: number }>{
        
        //get the name of the model
        const modelClassName = model.name;
        const dataName = (modelClassName?.replace(/Model$/,'') || '').toLowerCase();

        try{

            const attrsForPk = model.getAttributes();
            const pkEntry = Object.entries(attrsForPk).find(([_, a]) => (a as any).primaryKey === true);
            const uniqueField = pkEntry ? (pkEntry[0] as string) : 'id';
            const uniqueValue = values?.[uniqueField];
  
            // check that uniqueValue is not empty --------------------------------------------------
            if(uniqueValue === undefined || uniqueValue === null || uniqueValue === ""){
                throw new ValidationError('common.errors.validation.fillAllFields');
            }
            //check that updated values exists 
            if(!values || Object.keys(values).length === 0){
                throw new ValidationError('common.errors.validation.fillAllFields');
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
                    if ((value === undefined || value === null || value === "") && !rule.optional) {
                        throw new ValidationError('common.errors.validation.missingField');
                    }
                    if (value != null && !validateEnum(value, rule.enumObj as any)) {
                        throw new ValidationError('common.errors.validation.invalidField');
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
                throw new NotFoundError('common.errors.notFound');
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
                return { updated: false, updatedCount: 0 };
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
                throw new ConflictError('common.crud.notUpdated');
            }
            return { updated: true, updatedCount };

            //===================================================================================
            }catch(error){

                console.error(`Error occured while updating ${dataName}.`, error);
                throw error;
            }
        }
}
