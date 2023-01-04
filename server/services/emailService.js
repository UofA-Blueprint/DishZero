import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword'
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