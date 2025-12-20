// ========================================================================================
//? function used to validate the value provided for enum field
// ========================================================================================

export function validateEnum<T extends Record<string, string | number>>(value: string | number, enumObject: T): value is T[keyof T] {// it will create array of the keys of the provided enum 
    return Object.values(enumObject).includes(value);
}

// Record<string, string| number> ... (Reconrd<X, Y> where X is key and Y is value)
// ensures enumObject is an object where all values are strings or numbers ( enums store only strings or numbers)

//note on  :value T[keyof T] 
// it's where you expect input to be one of the enum values, to make TypeScript enforce that. It’s about input typing, not return valuesS
