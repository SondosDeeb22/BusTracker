//===================================================================================================
//? Importing
//===================================================================================================

//import models
import UserModel from "../models/userModel";

//import Enums
import {role, gender, status} from '../enums/userEnum';

// import exceptions 
import { ConflictError, InternalError, NotFoundError, ValidationError } from '../errors';

// services 
import AuthService from './authService';
const authService = new AuthService();

// helpers 
import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();



//===================================================================================================

export class DriverService{  

    //===================================================================================================
    //? function to Add Driver
    //===================================================================================================

    async addDriver(payload: Record<string, any>): Promise<{ messageKey: string }> {
        try {
            await helper.add(UserModel, payload, {
                nonDuplicateFields: ['email'],

                enumFields: [
                    { field: "status", enumObj: status },
                    { field: "role", enumObj: role },
                    { field: "gender", enumObj: gender }
                ],
                transform: async (data) => {
                    const out = { ...data };
                    if (out.email) out.email = out.email.toLowerCase().trim();
                    if (!out.status) out.status = status.active;
                    return out;
                },
            });

            // Send validation email
            if (payload?.email) {
                await authService.sendValidateEmail(String(payload.email));
            }

            return { messageKey: 'drivers.success.added' };
        
        // --------------------------------------------------------
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            if (error instanceof ConflictError) {
                throw new ConflictError('common.errors.validation.duplicateEmail');
            }
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalError('common.errors.internal');
        }
    }



    //===================================================================================================
    //? function to Remove Driver
    //===================================================================================================

    async removeDriver(driverId: unknown): Promise<{ messageKey: string }> {

            await helper.remove(UserModel, 'id', String(driverId));

            return { messageKey: 'common.crud.removed' }
    }

    //===================================================================================================
    //? function to Update Driver
    //===================================================================================================
    async updateDriver(payload: Record<string, any>): Promise<{ updated: boolean; messageKey: string }> {
 
        const result = await helper.update(UserModel, payload, {
            nonDuplicateFields: ["email"],
            enumFields: [
                { field: "status", enumObj: status },
                { field: "role", enumObj: role },
            ]
          }
        );

        return {
            updated: result.updated,
            messageKey: result.updated ? 'common.crud.updated' : 'common.crud.noChanges'
        };
   
    }

    //===================================================================================================
    //? function to Fetch All Drivers
    //===================================================================================================

    async fetchAllDrivers(): Promise<{ messageKey: string; data: unknown }> {
        try {
        const drivers = await UserModel.findAll({
            where: { role: role.driver },
            attributes: ['id', 'name', 'phone', 'email', 'licenseNumber', 'licenseExpiryDate', 'status']
        });

        return { messageKey: 'drivers.success.fetched', data: drivers };
        
        // --------------------------------------------------------------------------
        } catch (error) {
            throw new InternalError('common.errors.internal');
        }
    }
}