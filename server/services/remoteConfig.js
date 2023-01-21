const admin = require("firebase-admin");

const remoteConfig = {
    config: admin.remoteConfig(),

    getConfig: async function() {
        return await this.config.getTemplate();
    },

    // Gets the cron schedule for running the jobs
    getUserEmailReturnNotificationJob: async function() {
        let config = await this.getConfig();
        console.log("MSN Parse: ", config.parameters?.userEmailReturnNotificationJob?.defaultValue?.value)
        return config.parameters?.userEmailReturnNotification?.defaultValue?.value || "* * * * * *";
    }
};

module.exports = {
    remoteConfig,
}