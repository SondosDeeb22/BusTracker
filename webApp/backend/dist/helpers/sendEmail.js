"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
//===========================================================================================================
//? Import 
//==========================================================================================================
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const nodemailer_1 = __importDefault(require("nodemailer"));
const errors_1 = require("../errors");
//==========================================================================================================
const sendEmail = async (email, mailSubject, mailBody) => {
    try {
        // I'm creating the email transporter by using nodemailer, it will be used to send emails via SMTP server(Simple Mail Transfer Protocol)
        const transportOptions = {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false, // true for 465(SSL/TLS), false for other ports like 587 
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.APP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false // we use it to prevents some TLS-related issues
            }
        };
        const transporter = nodemailer_1.default.createTransport(transportOptions);
        // prepare the email body -----------------------------------------------------------------------
        const emailDetails = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: mailSubject,
            html: mailBody
        };
        // send the email------------------------------------------------------------------------------------
        await transporter.sendMail(emailDetails);
        return;
        // ----------------------------------------------------------------------------------------
    }
    catch (error) {
        console.log("Error occured while sending Email");
        throw new errors_1.EmailServiceError('common.errors.emailService');
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map