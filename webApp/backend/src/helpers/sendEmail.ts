//===========================================================================================================
//? Import 
//==========================================================================================================
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
            
import { EmailServiceError } from '../errors';
//==========================================================================================================

export const sendEmail = async (email: string, mailSubject: string, mailBody: string ):Promise< void > => {
    try{
        // I'm creating the email transporter by using nodemailer, it will be used to send emails via SMTP server(Simple Mail Transfer Protocol)
        const transportOptions: SMTPTransport.Options = { // SMTPTransport.Options has nodemailer's SMTP transport structure 
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false, // true for 465(SSL/TLS), false for other ports like 587 
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.APP_PASSWORD
        },
        tls: {// tls stand for Transport Layer Secure with 587 port 
            rejectUnauthorized: false// we use it to prevents some TLS-related issues
        }
        };
        const transporter = nodemailer.createTransport(transportOptions);


        // prepare the email body -----------------------------------------------------------------------
        const emailDetails = {
            from: process.env.EMAIL_SENDER,
            to: email, 
            subject: mailSubject,
            html: mailBody
        }; 

        // send the email------------------------------------------------------------------------------------
        await transporter.sendMail(emailDetails);

        return ;
        
    // ----------------------------------------------------------------------------------------
    }catch(error){
        console.log("Error occured while sending Email")
        throw new EmailServiceError('common.errors.emailService')       
    }

}