const Router = require("express").Router;
const {scheduledJobsController} = require('../controllers/scheduledJobsController.js');
const {cronService} = require("../services/cronService");

const router = Router()

// Updates the notification service to use the value from remote config
router.get('/update/returnDishNotificationFrequency', async (req, res, next) => {
    await scheduledJobsController.updateDishReturnReminder(req, res);
});

module.exports = {
    router
}