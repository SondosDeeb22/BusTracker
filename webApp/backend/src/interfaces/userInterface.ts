//==============================
// Import Enums 

import {role, gender, status, language, appearance} from '../enums/userEnum';

//==============================
//? User Attributes (used in userModel )
//==============================
export interface userAttributes{
    id: string;
    name: string;
    role: keyof typeof role;
    birthDate: string;
    gender: keyof typeof gender;

    phone: string;
    email: string;

    licenseNumber: string;
    licenseExpiryDate: string;

    status: keyof typeof status;
    hashedPassword: string;

    language: keyof typeof language;
    appearance: keyof typeof appearance;

}