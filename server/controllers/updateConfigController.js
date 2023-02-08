const {remoteConfig} = require("../services/remoteConfig.js");
const {cronService} = require("../services/cronService.js");
const cron = require("node-cron");

const updateConfigController = {
    // req should contain the updatedHour value
    updateNotificationReturnHourThreshold: async function(req, res) {
        try {
            let updatedHour = req.query.updatedHour;
            if (!updatedHour) {
                throw new Error("updatedHour param not present");
            }
            if (isNaN(+updatedHour)) throw new Error(`"Couldn't parse ${updatedHour} as Number`);
            await remoteConfig.updateUserEmailReturnNotificationHourThreshold(updatedHour);
            return res.send("Done");
        } catch(err) {
            res.status(400).send(err.message);
        }
    },

    // req should contain the updatedSchedule param
    updateUserEmailReturnNotificationJob: async function(req, res) {
        try {
            let updatedSchedule = req.query.updatedSchedule;
            if (!updatedSchedule) {
                throw new Error("updatedSchedule param not present");
            }
            // validate the CRON syntax
            if (!cron.validate(updatedSchedule)) throw new Error(`"Invalid Cron Syntax: ${updatedSchedule}`)
            await remoteConfig.updateUserEmailReturnNotificationJob(updatedSchedule);
            cronService.updateScheduledEmailNotificationJob();
            return res.send("Done");
        } catch(err) {
            res.status(400).send(err.message);
        }
    }
};

module.exports = {
    updateConfigController,
}

