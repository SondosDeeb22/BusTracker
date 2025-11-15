// ========================================================================================================
//? interface for login required data 
// ========================================================================================================
export interface loginData{
    email: string;
    password: string;
}


// ========================================================================================================
//? interface for data taken from user to perform password reset 
// ========================================================================================================
export interface resetPassword{
    email: string;
}


// ========================================================================================================
//? interface for the new password taken from user to perform password reset 
// ========================================================================================================
export interface NewPassword{
    newPassword: string;
    confirmPassword:string
}