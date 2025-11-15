//============================================================================================
// import User table interface 
//============================================================================================

import { userAttributes } from "../interfaces/userInterface";

//============================================================================================

const users: Array<userAttributes> = [
  {
    id: "A001",
    name: "Alice Johnson",
    role: "admin",
    birthDate: "1990-04-12",
    gender: "female",
    phone: "0501234567",
    email: "alice@example.com",
    licenseNumber: "LIC1001001",
    licenseExpiryDate: "2027-05-01",
    status: "active",
    hashedPassword: "$2b$10$examplehash1",
    language: "english",
    appearance: "light"
  },
  {
    id: "A002",
    name: "Admin Two",
    role: "admin",
    birthDate: "1991-01-01",
    gender: "female",
    phone: "0500000000",
    email: "admin2@example.com",
    licenseNumber: "LIC0000002",
    licenseExpiryDate: "2027-05-01",
    status: "active",
    hashedPassword: "$2b$10$examplehash2a",
    language: "english",
    appearance: "light"
  },
  {
    id: "D001",
    name: "Bob Smith",
    role: "driver",
    birthDate: "1985-11-03",
    gender: "male",
    phone: "0502345678",
    email: "bob@example.com",
    licenseNumber: "LIC1002002",
    licenseExpiryDate: "2026-10-15",
    status: "active",
    hashedPassword: "$2b$10$examplehash2",
    language: "turkish",
    appearance: "light"
  },
  {
    id: "D002",
    name: "Carol Davis",
    role: "driver",
    birthDate: "1992-07-19",
    gender: "female",
    phone: "0503456789",
    email: "carol@example.com",
    licenseNumber: "LIC1003003",
    licenseExpiryDate: "2028-01-20",
    status: "passive",
    hashedPassword: "$2b$10$examplehash3",
    language: "english",
    appearance: "light"
  },
  {
    id: "D003",
    name: "Tiana Lee",
    role: "admin",
    birthDate: "1988-02-28",
    gender: "male",
    phone: "0504567890",
    email: "D003@example.com",
    licenseNumber: "LIC1004004",
    licenseExpiryDate: "2027-03-11",
    status: "active",
    hashedPassword: "$2b$08$y9irsv4cSLs6f4CCvjsVPOkMNPoSr7qdqobI38vWYSjvKf.LoBKYi",
    language: "turkish",
    appearance: "dark"
  },
  {
    id: "D004",
    name: "John Turner",
    role: "driver",
    birthDate: "1990-06-15",
    gender: "female",
    phone: "0505678901",
    email: "john@gmail.com",
    licenseNumber: "LIC1005005",
    licenseExpiryDate: "2027-12-31",
    status: "active",
    hashedPassword: "$2b$08$hLLXN.Sd9ezYwW.KoM/goOp0ghEBFB7tHjnm7gNsfenu92pXCukzm",
    language: "english",
    appearance: "dark"
  },
];

//============================================================================================
export default users;
