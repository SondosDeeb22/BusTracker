"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHelper = void 0;
const add_1 = require("./userHelper/add");
const remove_1 = require("./userHelper/remove");
const update_1 = require("./userHelper/update");
//===================================================================================================================================================
//===================================================================================================================================================
class UserHelper {
    //?==========================================================================================================
    //? function to ADD data
    //========================================================================================================
    async add(model, payload, options) {
        const mappedOptions = {};
        if (options?.nonDuplicateFields)
            mappedOptions.nonDuplicateFields = options.nonDuplicateFields;
        if (options?.enumFields)
            mappedOptions.enumFields = options.enumFields;
        if (options?.transform) {
            mappedOptions.transform = options.transform;
        }
        await (0, add_1.add)(model, payload, options ? mappedOptions : undefined);
    }
    //?==========================================================================================================
    //? function to Remove data
    //==========================================================================================================
    async remove(model, uniqueField, uniqueValue) {
        return (0, remove_1.remove)(model, uniqueField, uniqueValue);
    }
    //?==========================================================================================================
    //? function to Update data
    //==========================================================================================================
    async update(model, values, options) {
        const mappedOptions = {};
        if (options?.nonDuplicateFields)
            mappedOptions.nonDuplicateFields = options.nonDuplicateFields;
        if (options?.enumFields)
            mappedOptions.enumFields = options.enumFields;
        if (options?.disallowFields)
            mappedOptions.disallowFields = options.disallowFields;
        if (options?.transform) {
            mappedOptions.transform = options.transform;
        }
        return (0, update_1.update)(model, values, options ? mappedOptions : undefined);
    }
}
exports.UserHelper = UserHelper;
//# sourceMappingURL=userHelper.js.map