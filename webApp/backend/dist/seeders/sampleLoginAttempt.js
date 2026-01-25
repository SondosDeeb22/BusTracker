"use strict";
//============================================================================================
// import LoginAttempt table interface 
//============================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
//============================================================================================
const loginAttempts = [
    {
        userEmail: "alice@example.com",
        IPaddress: "192.168.1.10",
        attemptLocation: null,
        attemptSuccessful: true,
        attemptTime: "08:15:23",
        attemptDate: new Date("2025-01-15"),
    },
    {
        userEmail: "bob@example.com",
        IPaddress: "192.168.1.11",
        attemptLocation: null,
        attemptSuccessful: false,
        attemptTime: "09:45:00",
        attemptDate: new Date("2025-01-15"),
    },
    {
        userEmail: "carol@example.com",
        IPaddress: "10.0.0.5",
        attemptLocation: null,
        attemptSuccessful: true,
        attemptTime: "14:02:10",
        attemptDate: new Date("2025-01-16"),
    },
    {
        userEmail: "david@example.com",
        IPaddress: "172.16.0.3",
        attemptLocation: null,
        attemptSuccessful: false,
        attemptTime: "18:30:45",
        attemptDate: new Date("2025-01-16"),
    },
    {
        userEmail: "eve@example.com",
        IPaddress: "203.0.113.55",
        attemptLocation: null,
        attemptSuccessful: true,
        attemptTime: "22:05:59",
        attemptDate: new Date("2025-01-17"),
    },
];
//============================================================================================
exports.default = loginAttempts;
//# sourceMappingURL=sampleLoginAttempt.js.map