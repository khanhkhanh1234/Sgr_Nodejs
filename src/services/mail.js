const nodemailer = require('nodemailer');

const mailService2= {
    async sendEmail ({ emailTo, emailSubject, emailText}) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'quockhanhlanglim@gmail.com',
                pass: 'tukbreczuozdzike'
            }
        });
      await transporter.sendMail({
        to : emailTo,
        subject : emailSubject,
        text : emailText
        });
      }
    
};

Object.freeze(mailService2);
module.exports = {
    mailService2,
};