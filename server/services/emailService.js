const { db } = require("../db.js");

const emailService = {
    sendReminderEmail: async function (to, subject, body) {
        // TODO: SEND EMAIL
        let mailOptions = {
            to: to,
            subject: subject,
            text: body,
        };
        // uses firebase mail service to send email
        // db.collection('mail').add(mailOptions)
        console.log("EMAIL SENT: ", to, subject, body); // TODO: Remove this
    }
};

module.exports = {
    emailService,
}