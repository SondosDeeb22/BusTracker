//interface for the login attempt data from the model/table
export interface LoginAttemptData{
    attemptID: number, 
    userEmail: string,
    IPaddress: string,
    attemptLocation: string,
    attemptSuccessful: boolean,
    attemptTime: string,
    attemptDate: Date
}
