
const firestore = require("../db.js");
// const emailService = require("../services/emailService.js");

// const transactionService = require("../services/transactionService.js");
const {remoteConfig} = require("../services/remoteConfig.js");
// const userService = require("../services/userService.js");

const scheduledJobsController = {

    // Schedules a job to send the reminder to return the borrowed dish
    dishCheckoutReturnReminder: async function (req, res) {
        try {
            let transId = req.query.transId;
            let config = await remoteConfig.getConfig();
            res.send(config);
        } catch(err) {
            console.log("ERR")
            res.status(400).send(err.message);
        }
        // const delay = (await userService.getAdminConfig()).emailNotificationDelay; // TODO: Get this through the db
        // const notifDate = new Date();
        // notifDate.setSeconds(notifDate.getSeconds() + delay);

        // const job = schedule.scheduleJob(notifDate, async function(transId) {
        //     try {
        //         let trans = await transactionService.getTransaction(transId);
        //         let returned = await transactionService.isDishReturnedForTransactionObject(trans);
        //         if (returned) {
        //             // dish is returned, no email required
        //             return;
        //         }
        //         // send the reminder
        //         let user = await userService.getUserFromAuth(trans?.user || "");
        //         // TODO: Fix the subject and body
        //         await emailService.sendReminderEmail(user.email, "Return Dish Reminder", "Please return dish");
        //     } catch (err) {
        //         console.log(err)
        //     }
        // }.bind(null, transId));
    },
};

module.exports = {
    scheduledJobsController,
}

