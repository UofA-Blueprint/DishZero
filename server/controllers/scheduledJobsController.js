
const firestore = require("../db.js");
const { cronService } = require("../services/cronService.js");
// const emailService = require("../services/emailService.js");

// const transactionService = require("../services/transactionService.js");
const {remoteConfig} = require("../services/remoteConfig.js");
const { transactionService } = require("../services/transactionService.js");
// const userService = require("../services/userService.js");

const scheduledJobsController = {
    updateDishReturnReminder: async function(req, res) {
        try {
            await cronService.updateScheduledEmailNotificationJob();
            return res.send("Done");
        } catch(err) {
            console.log("ERR")
            res.status(400).send(err.message);
        }
    }
};

module.exports = {
    scheduledJobsController,
}

