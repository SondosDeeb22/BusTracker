"use strict";
// ========================================================================================
//? function used to validate the value provided for enum field
// ========================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnum = validateEnum;
function validateEnum(value, enumObject) {
    return Object.values(enumObject).includes(value);
}
// Record<string, string| number> ... (Reconrd<X, Y> where X is key and Y is value)
// ensures enumObject is an object where all values are strings or numbers ( enums store only strings or numbers)
//note on  :value T[keyof T] 
// it's where you expect input to be one of the enum values, to make TypeScript enforce that. It’s about input typing, not return valuesS
//# sourceMappingURL=validateEnumValue.js.map