//==========================================================================================================
//? Import
//==========================================================================================================

import BusModel from "../../models/busModel";

import { ForbiddenError } from "../../errors";

//==========================================================================================================

export const validateUserById = async (driverId: number, busId: string): Promise<true> => {
    try {
        if (!busId) {
            throw new ForbiddenError("common.errors.forbidden");
        }

        const userauthorized = await BusModel.findOne({
            where: {
                id: busId,
                assignedDriver: driverId,
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
