const nodemailer = require('nodemailer');

const sendEmail = async (from = '', to, subject, message, service) => {
    let response;
    let serviceHost = '';
    let mport;
    let msecure;

    if(service == 'test'){
        serviceHost = 'smtp.ethereal.email';
        mport = 587;
        msecure = false;

        if(from == ''){
            from = process.env.EMAIL_USER;
        }
    }

    if(service == 'gmail'){
        serviceHost = 'smtp.gmail.com';
        mport = 465;
        msecure = true;

        if(from == ''){
            from = process.env.EMAIL_USER;
        }
    }

    try{
        const transporter = await nodemailer.createTransport({
            host: serviceHost,
            port: mport,
            secure: msecure,
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
            }
        });
    
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: message,
        };

        // Send email using await
        const info = await transporter.sendMail(mailOptions);

        response = {
            status: 200,
            type: 'success',
            msg: info.response || 'Mail sent.'
        }
    } catch(error){
        response = {
            status: 400,
            type: 'error',
            msg: error || 'Oops! Passwords don\'t match. Please re-enter.'
        }
    }

    return response;
}

module.exports = sendEmail;