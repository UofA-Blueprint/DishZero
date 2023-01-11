import schedule from "node-schedule";

import firestore from "../db.js";
import emailService from "../services/emailService.js";

import transactionService from "../services/transactionService.js";
import userService from "../services/userService.js";

const scheduledJobsController = {

    // Schedules a job to send the reminder to return the borrowed dish
    dishCheckoutReturnReminder: async function (transId, userId, dishId) {
        const delay = (await userService.getAdminConfig()).emailNotificationDelay; // TODO: Get this through the db
        const notifDate = new Date();
        notifDate.setSeconds(notifDate.getSeconds() + delay);

        const job = schedule.scheduleJob(notifDate, async function(transId, userId, dishId) {
            try {
                let returned = await transactionService.isDishReturnedForTransaction(transId)
                if (returned) {
                    // dish is returned, no email required
                    return;
                }
                // send the reminder
                let user = await userService.getUser(userId);
                // TODO: Fix the subject and body
                await emailService.sendReminderEmail(user.getEmail(), "Return Dish Reminder", "Please return dish");
            } catch (err) {
                console.log(err)
            }
            
        }.bind(null, transId, userId, dishId));
    },
};

export default scheduledJobsController;

