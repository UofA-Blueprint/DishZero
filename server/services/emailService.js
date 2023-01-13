import nodemailer from "nodemailer"

import config from "../config.js";

const transporter = nodemailer.createTransport({
    service: config.emailConfig.service,
    auth: {
      user: config.emailConfig.user,
      pass: config.emailConfig.pass,
    }
});

const emailService = {
    sendReminderEmail: async function (to, subject, body) {
        // TODO: SEND EMAIL
        let mailOptions = {
            from: 'youremail@gmail.com',
            to: to,
            subject: subject,
            text: body,
        };
        // transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        // });
        console.log("EMAIL SENT: ", to, subject, body); // TODO: Remove this
    }
};

export default emailService;