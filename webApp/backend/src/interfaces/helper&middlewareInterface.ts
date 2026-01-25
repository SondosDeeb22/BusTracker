// ========================================================================================================


//interface for data stored in JWT
export interface JWTdata{
    userID: number;
    userName: string;
    userRole: string;
}

// interface for the data we store for the user location stored in loginAttempt table
export interface LocationData {
    city: string;
    country: string;
    region: string;
}

export interface userIPaddressAndLocation{
    ip: string | null, 
    location: string | null
}

