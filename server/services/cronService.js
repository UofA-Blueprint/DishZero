const cron = require("node-cron");
const { emailService } = require("./emailService");
const {remoteConfig} = require("./remoteConfig"); 
const { transactionService } = require("./transactionService");
// const {transactionService} = req

/**
 * Class for managing the cron jobs for the application
 */
class CronService {
    constructor() {
        this.scheduledEmailNotificationTask = null;
        this.i = 1;
        this.init();
    }

    async init() {
        this.scheduledEmailNotificationTask = await this.getScheduledEmailNotification();
    }

    async emailNotificationJob(cronObj) {
        try {
            let users = await transactionService.getAllUsersPendingNotification();
            await emailService.sendReminderEmail(users, "Return Dish", "Overdue dish");
        } catch(e) {
            console.log("Err: ", e)
        }
    }
    
    async getScheduledEmailNotification() {
        let cronSch = await remoteConfig.getCachedUserEmailReturnNotificationJob();
        cron.validate(cronSch)
        return cron.schedule(cronSch, () => this.emailNotificationJob(this));
    }

    // update the schedule of the running task for sending notification to users
    async updateScheduledEmailNotificationJob() {
        this.scheduledEmailNotificationTask.stop();
        remoteConfig.resyncConfig();
        // get the new config and validate it, then start the job
        this.scheduledEmailNotificationTask = await this.getScheduledEmailNotification();
    }
};

const cronService = new CronService();

module.exports = {
    cronService,
}