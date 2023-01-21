const cron = require("node-cron");
const {remoteConfig} = require("./remoteConfig") 


class CronService {
    constructor() {
        this.scheduledEmailNotificationTask = null;
        this.init();
    }

    async init() {
        this.scheduledEmailNotificationTask = await this.getScheduledEmailNotification();
    }

    async emailNotificationJob() {
        console.log("HELLO");
    }
    
    async getScheduledEmailNotification() {
        let cronSch = await remoteConfig.getUserEmailReturnNotificationJob();
        console.log("cronsch: ", cronSch)
        // TODO: Add verification for cron sch
        return cron.schedule(cronSch, this.emailNotificationJob);
    }
    
};

module.exports = {
    cronService: new CronService(),
}