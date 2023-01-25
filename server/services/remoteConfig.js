const admin = require("firebase-admin");

class RemoteConfig {
    constructor() {
        this.config = admin.remoteConfig()
        this.cachedUserEmailReturnNotificationJob = "* * * * *"
        this.cachedUserEmailReturnNotificationHourThreshold = 168
        this.cacheInit = false;
    }

    async getCachedUserEmailReturnNotificationJob() {
        if (!this.cacheInit) {
            this.cachedUserEmailReturnNotificationJob = await this.getUserEmailReturnNotificationJob();
            this.cachedUserEmailReturnNotificationHourThreshold = await this.getUserEmailReturnNotificationHourThreshold();
            this.cacheInit = true;
        }
        return this.cachedUserEmailReturnNotificationJob;
    }

    async getCachedUserEmailReturnNotificationHourThreshold() {
        if (!this.cacheInit) {
            this.cachedUserEmailReturnNotificationJob = await this.getUserEmailReturnNotificationJob();
            this.cachedUserEmailReturnNotificationHourThreshold = await this.getUserEmailReturnNotificationHourThreshold();
            this.cacheInit = true;
        }
        return this.cachedUserEmailReturnNotificationHourThreshold;
    }

    // Forces the cache to be updated when values read again
    resyncConfig() {
        this.cacheInit = false;
    }

    async getConfig() {
        return await this.config.getTemplate();
    }

    // Gets the cron schedule for running the jobs
    async getUserEmailReturnNotificationJob() {
        let config = await this.getConfig();
        return config.parameters?.userEmailReturnNotificationJob?.defaultValue?.value || "* * * * * *";
    }

    // gets the hour threshold for the email
    async getUserEmailReturnNotificationHourThreshold() {
        let config = await this.getConfig();
        return config.parameters?.userEmailReturnNotificationHourThreshold?.defaultValue?.value || 168;
    }
};

const remoteConfig = new RemoteConfig()

module.exports = {
    remoteConfig,
}