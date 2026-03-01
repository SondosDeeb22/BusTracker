//==========================================================================================================
//? Import
//==========================================================================================================

import BusModel from "../../models/busModel";

import { ForbiddenError } from "../../errors";

//==========================================================================================================

export const validateUserById = async (driverId: string, busId: string): Promise<true> => {
    try {
        if (!busId) {
            throw new ForbiddenError("common.errors.forbidden");
        }

        void driverId;

        const userauthorized = await BusModel.findOne({
            where: {
                id: busId,
            },
            attributes: ['id'],
        });

        if (!userauthorized) {
            throw new ForbiddenError("common.errors.forbidden");
        }

        return true;
    } catch (error) {
        console.error("Error occured while validating user/bus relation", error);
        throw error;
    }
};
